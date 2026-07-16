import {Component, Injector, ViewChild, afterNextRender, inject} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatTabChangeEvent, MatTabGroup} from '@angular/material/tabs';
import {ActivatedRoute, Router} from '@angular/router';


import {TranslateService} from '@ngx-translate/core';
import {Observable, firstValueFrom, map, of} from 'rxjs';

import {BaseFormComponent} from '@app/components/base-form.component';
import {DataTableDefinition} from '@app/components/data-tables.util';
import {RelationGridComponent} from '@app/components/shared/relation-grid/relation-grid.component';
import {Configuration} from "@app/core/config/configuration";
import {MessagesInterceptorStateService} from '@app/core/interceptors/messages.interceptor';
import {
  Application,
  ApplicationService,
  CodeListService,
  Role,
  RoleService,
  TranslationService,
  Tree,
  TreeNode,
  TreeRulesService,
  TreeService
} from '@app/domain';
import {AdminRuntimeConfigurationService} from '@app/domain/admin-configuration/services/admin-runtime-configuration.service';
import {onUpdatedRelation, Status} from '@app/frontend-gui/src/lib/public_api';
import {ErrorHandlerService} from '@app/services/error-handler.service';
import {LoadingOverlayService} from "@app/services/loading-overlay.service";
import {LoggerService} from '@app/services/logger.service';
import {UtilsService} from '@app/services/utils.service';
import {
  formatImageAccept,
  getImageUploadErrorKey,
  validateImageUpload,
} from '@app/utils/image-upload.utils';
import {config} from '@config';
import {constants} from '@environments/constants';

import {TreeNodesComponent} from './tree-nodes/tree-nodes.component';

@Component({
    selector: 'app-trees-form',
    templateUrl: './trees-form.component.html',
    styleUrls: ['./trees-form.component.scss'],
    standalone: false
})
export class TreesFormComponent extends BaseFormComponent<Tree> {
  /** Tab index of "Tree structure" (second tab: Details, Tree, Applications, Roles). */
  static readonly TREE_STRUCTURE_TAB_INDEX = 1;

  readonly config = Configuration.TREE;
  readonly treeTypeNodeTypes = config.treeTypeNodeTypes;
  override readonly codeValues = constants.codeValue;

  private readonly injector = inject(Injector);
  private readonly treeRulesService = inject(TreeRulesService);
  private readonly adminConfigService = inject(AdminRuntimeConfigurationService);

  /** Params for `entity.tree.image.resizeHint`. Emits once backend config loads; hint hidden until then. */
  readonly treeImageResizeHintParams$: Observable<{ width: number; height: number; maxSizeMb: number }> =
    this.adminConfigService.getTreeImageUploadConfiguration().pipe(
      map(({ defaultSize, maxBytes }) => ({
        width: defaultSize.width,
        height: defaultSize.height,
        maxSizeMb: Math.round(maxBytes / (1024 * 1024)),
      }))
    );

  readonly treeImageAccept$: Observable<string> = this.adminConfigService.getTreeImageUploadConfiguration().pipe(
    map(({ supportedFormats }) => formatImageAccept(supportedFormats))
  );

  treeImagePreviewState: 'uploaded' | 'stored' = 'stored';

  currentTreeType: string;
  eagerLoadTreeStructure = false;
  private duplicateStructureTabPrimed = false;
  /** Tab to restore after priming finishes; null when no prime is in flight. */
  private pendingRestoreTabIdx: number | null = null;
  @ViewChild('tabGroup') tabGroup: MatTabGroup;
  @ViewChild('applicationsGrid') applicationsGrid?: RelationGridComponent;

  private _treeNodesComponent: TreeNodesComponent | undefined;

  /**
   * Two-way accessor decorated with @ViewChild so Angular populates it when the lazy
   * matTabContent portal attaches the child. Tests still assign via the public setter.
   */
  @ViewChild('treeNodesComponent')
  set treeNodesComponent(c: TreeNodesComponent | undefined) {
    this._treeNodesComponent = c;
    this.handleTreeNodesComponentReady(c);
  }
  get treeNodesComponent(): TreeNodesComponent | undefined {
    return this._treeNodesComponent;
  }

  /**
   * Data table configuration for managing tree applications.
   * Handles application assignments with duplicate prevention.
   * Columns: checkbox, ID, name (editable), status
   */
  readonly applicationsTable: DataTableDefinition<Application, Application>;

  /**
   * Data table configuration for managing tree roles.
   * Handles role assignments.
   * Columns: checkbox, ID, name (editable), status
   */
  readonly rolesTable: DataTableDefinition<Role, Role>;

  constructor(
    dialog: MatDialog,
    translateService: TranslateService,
    translationService: TranslationService,
    codeListService: CodeListService,
    loggerService: LoggerService,
    errorHandler: ErrorHandlerService,
    activatedRoute: ActivatedRoute,
    router: Router,
    loadingService: LoadingOverlayService,
    messagesInterceptorState: MessagesInterceptorStateService,
    public utils: UtilsService,
    private treeService: TreeService,
    private applicationService: ApplicationService,
    private roleService: RoleService
  ) {
    super(dialog, translateService, translationService, codeListService, loggerService, errorHandler, activatedRoute, router, loadingService, messagesInterceptorState);
    this.applicationsTable = this.defineApplicationsTable();
    this.rolesTable = this.defineRolesTable();
    this.initializeTreesForm();
  }

  override afterFetch(): void {
    super.afterFetch();
    this.scheduleDuplicateTreeTabPrime();
  }

  /**
   * matTabContent only attaches when its tab becomes center. For duplication we need TreeNodesComponent
   * instantiated while the user stays on General. Prime by switching to the tree tab; the ViewChild
   * setter fires when the portal attaches and triggers the tab restore.
   * mat-tab-group uses preserveContent=true so leaving the tab does not detach the portal (see tabs.mjs).
   */
  private scheduleDuplicateTreeTabPrime(): void {
    if (!this.eagerLoadTreeStructure || !this.dataLoaded || this.duplicateStructureTabPrimed) {
      return;
    }
    this.duplicateStructureTabPrimed = true;
    afterNextRender(() => {
      const group = this.tabGroup;
      if (!group) {
        return;
      }
      if (this._treeNodesComponent) {
        return;
      }
      this.pendingRestoreTabIdx = group.selectedIndex ?? 0;
      group.selectedIndex = TreesFormComponent.TREE_STRUCTURE_TAB_INDEX;
    }, {injector: this.injector});
  }

  /** Called by the @ViewChild setter when the lazy tree-nodes child mounts; restores the originally selected tab. */
  private handleTreeNodesComponentReady(c: TreeNodesComponent | undefined): void {
    if (!c || this.pendingRestoreTabIdx === null) {
      return;
    }
    const idx = this.pendingRestoreTabIdx;
    this.pendingRestoreTabIdx = null;
    afterNextRender(() => {
      if (this.tabGroup) {
        this.tabGroup.selectedIndex = idx;
      }
      this.activeTabIndex = idx;
    }, {injector: this.injector});
  }

  /**
   * Prepares component data before fetching the entity.
   * Initializes translations and loads code lists.
   *
   * @returns Promise that resolves when initialization is complete
   */
  override async preFetchData() {
    this.dataTables.register(this.applicationsTable);
    this.dataTables.register(this.rolesTable);
    this.initTranslations('Tree', ['name', 'description']);
    await this.initCodeLists([
      'tree.type',
      'treenode.node.type',
      'treenode.viewmode'
    ]);
  }

  /**
   * Fetches the original entity by ID for editing.
   *
   * @returns Promise resolving to the tree entity
   */
  override async fetchOriginal(): Promise<Tree> {
    return firstValueFrom(this.treeService.get(this.entityID));
  }

  /**
   * Creates a copy of an existing entity for duplication.
   * Prefixes the name with "copy_" to distinguish it from the original.
   *
   * @returns Promise resolving to the duplicated tree entity
   */
  override async fetchCopy(): Promise<Tree> {
    return firstValueFrom(this.treeService.get(this.duplicateID).pipe(
      map((copy: Tree) => {
        copy.name = this.translateService.instant('common.copyPrefix') + copy.name;
        return copy;
      })
    ));
  }

  /**
   * Creates an empty tree entity with default values.
   * Sets default type from code list.
   *
   * @returns New empty tree entity
   */
  override empty(): Tree {
    const defaultType = this.defaultValueOrNull('tree.type');
    const tree = new Tree();
    if (defaultType) {
      tree.type = defaultType.value;
    }
    return tree;
  }

  /**
   * Initializes the form after entity data is fetched.
   * Sets up reactive form with entity values and validation rules.
   */
  override postFetchData() {
    if (!this.entityToEdit) {
      throw new Error('Cannot initialize form: entity is undefined');
    }

    this.entityForm.patchValue({
      id: this.entityToEdit.id ?? null,
      name: this.entityToEdit.name ?? null,
      description: this.entityToEdit.description ?? null,
      type: this.entityToEdit.type ?? null,
      image: this.entityToEdit.image ?? null,
      imageName: this.entityToEdit.imageName ?? null
    });

    this.currentTreeType = this.entityToEdit.type;
    this.treeImagePreviewState = 'stored';

    // Set default type for new trees
    if (this.isNew() && !this.entityToEdit.type) {
      const defaultType = this.defaultValueOrNull('tree.type');
      if (defaultType) {
        this.entityForm.patchValue({ type: defaultType.value });
        this.currentTreeType = defaultType.value;
      }
    }

    // Set stable flag for eager tree structure loading during duplication
    this.eagerLoadTreeStructure = this.isDuplicated();

    // Image preview is now handled by the ImagePreviewComponent via imageSource input
  }

  /**
   * Fetches related data for the tree entity.
   * Loads translations for the current entity.
   *
   * @returns Promise that resolves when related data is loaded
   */
  override async fetchRelatedData(): Promise<void> {
    if (this.isEdition()) {
      await this.loadTranslations(this.entityToEdit);
    }
  }

  /**
   * Override save button click to include tree-specific validations.
   * Validates tree type change against applications before saving.
   */
  override async onSaveButtonClicked(): Promise<boolean> {
    if (!this.treeValidations(true)) {
      return Promise.resolve(false);
    }

    if (!await this.validateUniqueName()) {
      return Promise.resolve(false);
    }

    // Validate tree type change against applications (only for existing trees)
    if (this.isEdition() && await this.validateTreeTypeChange()) {
      return super.onSaveButtonClicked();
    } else if (this.isNew() || this.isDuplicated()) {
      // Skip validation for new/duplicated trees
      return super.onSaveButtonClicked();
    }

    return Promise.resolve(false);
  }

  override afterSave(): void {
    this.entityForm.patchValue({
      image: this.entityToEdit?.image ?? null,
      imageName: this.entityToEdit?.imageName ?? null,
    }, { emitEvent: false });
    this.treeImagePreviewState = 'stored';
    super.afterSave();
  }

  /** Rejects save when another tree already uses the same name (case-insensitive). */
  private async validateUniqueName(): Promise<boolean> {
    const rawName = this.entityForm.get('name')?.value;
    const name = typeof rawName === 'string' ? rawName.trim() : '';
    if (!name) {
      return true;
    }

    try {
      const page = await firstValueFrom(this.treeService.searchTextPage(name, { size: 20 }));
      const duplicate = page.rows.some((tree) =>
        tree.id !== this.entityID
        && typeof tree.name === 'string'
        && tree.name.trim().toLowerCase() === name.toLowerCase()
      );
      if (duplicate) {
        this.errorHandler.handleError(null, 'entity.tree.error.duplicateName');
        return false;
      }
      return true;
    } catch (error) {
      this.errorHandler.handleError(error);
      return false;
    }
  }

  /**
   * Validates tree type change against candidate applications.
   *
   * This validation is necessary because Spring Data REST requires two separate
   * PUT operations. Without proactive validation, the tree type PUT could succeed
   * while the applications PUT fails, requiring a rollback that violates REST
   * principles.
   *
   * @returns Promise<boolean> - true if validation passes, false if it fails
   */
  private async validateTreeTypeChange(): Promise<boolean> {
    const newType = this.entityForm.get('type')?.value;

    // If type hasn't changed, no validation needed
    if (newType === this.entityToEdit.type) {
      return true;
    }

    try {
      // Get applications from the data grid (includes new, modified, not deleted)
      const gridData = this.applicationsGrid?.getAllCurrentData() || [];

      // Filter out applications marked for deletion and extract IDs
      const applicationIds = gridData
        .filter((app: any) => app.status !== 'pendingDelete')
        .map((app: Application) => app.id)
        .filter((id: number) => id != null);

      // Call validation endpoint
      await firstValueFrom(
        this.treeService.validateTypeChange(
          this.entityID,
          newType,
          applicationIds
        )
      );

      return true;
    } catch (_) {
      // Validation failed - error handled by error interceptor
      return false;
    }
  }

  /**
   * Creates a Tree object from the current form values.
   *
   * @param id - Optional ID for the new object, used when updating
   * @returns New Tree instance populated with form values
   */
  createObject(id: number = null): Tree {
    let safeToEdit = Tree.fromObject(this.entityToEdit);
    const formValues = this.entityForm.getRawValue();
    safeToEdit = Object.assign(safeToEdit, formValues, {
      id: id
    });
    return safeToEdit;
  }

  /**
   * Creates a new tree entity in the database.
   * Creates the tree using form values and returns the ID of the created entity.
   *
   * @returns Promise resolving to the ID of the created entity
   */
  override async createEntity(): Promise<number> {
    const entityToCreate = this.createObject();
    const entityCreated = await firstValueFrom(this.treeService.create(entityToCreate));
    return entityCreated.id;
  }

  /**
   * Updates an existing tree entity with form values.
   * Calls the service update API to persist the changes.
   *
   * @returns Promise that resolves when the update is complete
   */
  override async updateEntity() {
    const entityToUpdate = this.createObject(this.entityID);
    await firstValueFrom(this.treeService.update(entityToUpdate));
  }

  /**
   * Updates related data after the main entity is saved.
   * Saves translations and tree nodes.
   *
   * @param _isDuplicated - Whether this is a duplication operation
   * @returns Promise that resolves when all related updates are complete
   */
  override async updateDataRelated(_isDuplicated: boolean): Promise<void> {
    const entityToUpdate = this.createObject(this.entityID);
    await this.saveTranslations(entityToUpdate);

    // Save nodes through subcomponent
    if (this.treeNodesComponent) {
      await this.treeNodesComponent.saveNodes(this.entityToEdit, this.entityID);
    } else if (_isDuplicated) {
      this.loggerService.warn(
        'TreesFormComponent.updateDataRelated: treeNodesComponent missing during duplication; nodes were not saved.'
      );
    }
  }

  /**
   * Matches canSaveEntity so the toolbar and save action do not diverge when switching tabs.
   */
  override canSave(): boolean {
    return this.canSaveEntity;
  }

  protected override hasPendingChanges(): boolean {
    return super.hasPendingChanges()
      || (this.treeNodesComponent?.hasUnsavedChangesForToolbar() ?? false);
  }

  /**
   * Computed property that determines if the save button should be enabled.
   * Extends base implementation to include tree node change detection.
   * Does not treat "duplicate opened" alone as a change: Save enables only when the form, grids,
   * translations, or tree nodes report real edits (cloned nodes appear as pending until first save).
   *
   * @returns True if save button should be enabled, false otherwise
   */
  override get canSaveEntity(): boolean {
    if (this.eagerLoadTreeStructure && !this.isDuplicatedTreeReadyForSave()) {
      return false;
    }

    const baseCanSave = super.canSaveEntity;
    const hasTreeNodeChanges = this.treeNodesComponent?.hasUnsavedChangesForToolbar() ?? false;
    const isFormValid = this.entityForm?.valid ?? false;
    const hasAnyChanges = baseCanSave || (isFormValid && hasTreeNodeChanges);

    return hasAnyChanges && this.treeValidations();
  }

  /**
   * Checks if a duplicated tree's structure data is ready for saving.
   * For non-duplicate flows, always returns true.
   * For duplicates, ensures the tree data has been loaded into the data tree component.
   *
   * @returns True if ready to save, false if still loading
   */
  private isDuplicatedTreeReadyForSave(): boolean {
    if (!this.eagerLoadTreeStructure) {
      return true;
    }

    return (this.treeNodesComponent?.getNodesForValidation()?.length ?? 0) > 0;
  }

  /**
   * Non-blocking explanation shown in toolbar when save is disabled by tree-specific rules.
   * Required field feedback is already handled by the validation banner component.
   */
  get treeValidationWarningMessage(): string {
    if (!this.dataLoaded || !this.entityForm) {
      return '';
    }
    if (this.entityForm.invalid) {
      return '';
    }

    const validationError = this.getTreeValidationErrorCode();
    if (validationError === 'treeStructure') {
      const nodes = this.treeNodesComponent?.getNodesForValidation() || [];
      const filterNodes = nodes.filter(a => (a as any).status !== 'pendingDelete');
      return this.getTreeStructureWarningMessage(filterNodes as any);
    }
    if (validationError === 'nodeType') {
      return this.translateService.instant('error.tree-type-node-constraint');
    }
    return '';
  }

  /** Returns a specific tree-structure warning message for the current failing scenario. */
  private getTreeStructureWarningMessage(treeNodes: TreeNode[]): string {
    if (this.currentTreeType !== this.codeValues.treeType.touristicTree) {
      return this.translateService.instant('treeStructureMessage');
    }

    if (!Array.isArray(treeNodes) || treeNodes.length === 0) {
      return this.translateService.instant('treeStructureMessage');
    }

    const rootNode = treeNodes[0] as any;
    const rootChildren = Array.isArray(rootNode?.children) ? rootNode.children : [];
    const rootNodes = rootChildren.filter((n: any) => n.status !== 'pendingDelete');

    if (rootNodes.length > 1) {
      return this.translateService.instant('treeStructureMessage.touristic.singleRoot', { count: rootNodes.length });
    }
    if (rootNodes.length === 1) {
      const hasChildren = Array.isArray(rootNodes[0]?.children) && rootNodes[0].children.length > 0;
      if (!hasChildren) {
        return this.translateService.instant('treeStructureMessage.touristic.rootMustHaveChildren');
      }
    }

    return this.translateService.instant('treeStructureMessage');
  }

  /**
   * Tree structure tab requested save (same as toolbar Save).
   */
  onTreeSaveRequested(): void {
    void this.onSaveButtonClicked();
  }

  initializeTreesForm(): void {
    this.entityForm = new UntypedFormGroup({
      id: new UntypedFormControl(null, []),
      name: new UntypedFormControl(null, [Validators.required]),
      description: new UntypedFormControl(null, []),
      type: new UntypedFormControl(null, [Validators.required]),
      image: new UntypedFormControl(null, []),
      imageName: new UntypedFormControl(null, [])
    })
  }


  onTreeTypeChange(type: string): void {
    // Validate that all current nodes are compatible with the candidate tree type
    if (!this.validateTreeTypeCompatibility(type)) {
      // Revert to previous tree type
      this.entityForm.patchValue({ type: this.currentTreeType });
      this.utils.showNodeTypeConstraintError();
      return;
    }

    this.currentTreeType = type;
  }

  activeImageNameInput(formtype: string, input: HTMLInputElement): void {
    this.entityForm.patchValue({
      image: null,
      imageName: null,
    });
    this.markTreeImageAsModified();
    input.readOnly = false;
    input.focus();
  }

  removeImage(_formtype: string): void {
    this.entityForm.patchValue({
      image: null,
      imageName: null,
    });
    this.markTreeImageAsModified();
  }

  onImageChange(formtype: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.readOnly) {
      this.entityForm.patchValue({
        image: input.value
      });
      this.markTreeImageAsModified();
    }
  }

  async onImageSelected(formtype: string, event: Event): Promise<void> {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const { supportedFormats, maxBytes } = await firstValueFrom(this.adminConfigService.getTreeImageUploadConfiguration());
      const validation = validateImageUpload(file, supportedFormats, maxBytes);
      if (!validation.valid) {
        this.errorHandler.handleError(null, getImageUploadErrorKey(validation.error!), validation.errorParams);
        fileInput.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        this.entityForm.patchValue({
          image: reader.result,
          imageName: file.name
        });
        this.treeImagePreviewState = 'uploaded';
        this.markTreeImageAsModified();
        // Same filename can be selected again on the next open.
        fileInput.value = '';
      };
      reader.readAsDataURL(file);
      return;
    }
    fileInput.value = '';
  }

  private markTreeImageAsModified(): void {
    this.entityForm.markAsDirty();
  }

  /**
   * Validates whether all current nodes are compatible with a given tree type.
   * Checks both node type allowed lists and parent-child relationships.
   * @param candidateTreeType The tree type to validate against
   * @returns true if all nodes are compatible, false otherwise
   */
  validateTreeTypeCompatibility(candidateTreeType: string): boolean {
    const nodes = this.treeNodesComponent?.getNodesForValidation() || [];
    const filterNodes = nodes.filter(a => (a as any).status !== 'pendingDelete');

    return this.validNodeTypesForTreeType(filterNodes, candidateTreeType);
  }

  /**
   * Validates that all node types are allowed for the given tree type,
   * and that all parent-child relationships are valid.
   * @param treeNodes The nodes to validate
   * @param treeType The tree type to validate against (defaults to currentTreeType)
   * @returns true if all nodes are compatible, false otherwise
   */
  validNodeTypesForTreeType(treeNodes: any[], treeType?: string): boolean {
    const targetTreeType = treeType || this.currentTreeType;

    if (!targetTreeType || !this.treeTypeNodeTypes || !this.treeTypeNodeTypes[targetTreeType]) {
      return true; // No constraints defined
    }

    const allAllowedTypes = this.treeRulesService.getNodeTypesForTree(targetTreeType);

    // Build a map of nodes by ID for parent-child validation
    const nodeMap = new Map<number, any>();
    treeNodes.forEach(node => {
      if (node.id) {
        nodeMap.set(node.id, node);
      }
    });

    // Check each node
    for (const node of treeNodes) {
      const nodeType = node.nodeType;

      // Skip nodes without a type (legacy folders with null type are allowed)
      if (!nodeType) {
        continue;
      }

      // Check if node type is allowed for this tree type
      if (!allAllowedTypes.includes(nodeType)) {
        this.loggerService.warn(`Node type '${nodeType}' not allowed for tree type '${targetTreeType}'`, {
          nodeId: node.id,
          nodeName: node.name
        });
        return false;
      }

      // Check parent-child relationships (only for nodes with parents)
      if (node.parent && nodeMap.has(node.parent)) {
        const parentNode = nodeMap.get(node.parent);
        const parentType = parentNode.nodeType;

        // If parent has no type, skip validation (legacy folder)
        if (!parentType) {
          continue;
        }

        // Get allowed children for parent type
        const allowedChildren = this.treeRulesService.getAllowedChildrenForNodeType(targetTreeType, parentType);
        if (allowedChildren.length === 0) {
          this.loggerService.warn(`Parent node type '${parentType}' cannot have children`, {
            parentId: node.parent,
            parentName: parentNode.name,
            childId: node.id,
            childName: node.name
          });
          return false;
        }
        if (!allowedChildren.includes(nodeType)) {
          this.loggerService.warn(`Node type '${nodeType}' not allowed as child of '${parentType}'`, {
            parentId: node.parent,
            parentName: parentNode.name,
            childId: node.id,
            childName: node.name
          });
          return false;
        }
      }
    }

    return true;
  }

  treeValidations(showErrors = false): boolean {
    const validationError = this.getTreeValidationErrorCode();
    if (!validationError) {
      return true;
    }
    if (!showErrors) {
      return false;
    }
    if (validationError === 'required') {
      this.utils.showRequiredFieldsError();
    } else if (validationError === 'treeStructure') {
      this.utils.showTreeStructureError();
    } else if (validationError === 'nodeType') {
      this.utils.showNodeTypeConstraintError();
    }
    return false;
  }

  /** Returns first failing validation code, preserving current validation priority. */
  private getTreeValidationErrorCode(): 'required' | 'treeStructure' | 'nodeType' | null {
    const nodes = this.treeNodesComponent?.getNodesForValidation() || [];
    const filterNodes = nodes.filter(a => (a as any).status !== 'pendingDelete');

    if (!this.validTreeForm()) {
      return 'required';
    }
    if (!this.validTreeStructure(filterNodes as any)) {
      return 'treeStructure';
    }
    if (!this.validNodeTypesForTreeType(filterNodes as any)) {
      return 'nodeType';
    }
    return null;
  }

  validTreeForm(): boolean {
    return this.entityForm.valid;
  }

  validTreeStructure(treeNodes: TreeNode[]): boolean {
    let valid = true;
    if (this.currentTreeType === this.codeValues.treeType.touristicTree) {
      if (!Array.isArray(treeNodes) || treeNodes.length === 0) {
        return true;
      }
      const rootNode = treeNodes[0] as any;
      const rootChildren = Array.isArray(rootNode?.children) ? rootNode.children : [];
      const rootNodes = rootChildren.filter((n: any) => n.status !== 'pendingDelete');
      const singleRootHasChildren = rootNodes.length === 1 && Array.isArray(rootNodes[0]?.children) && rootNodes[0].children.length > 0;
      valid = rootNodes.length === 0 || singleRootHasChildren;
    }
    return valid;
  }


  activeTabIndex = 0;

  onTabChange(event: MatTabChangeEvent) {
    this.activeTabIndex = event.index;
  }

  /**
   * Defines the data table configuration for managing tree applications.
   * Sets up columns, data fetching, updating logic, and target selection.
   *
   * @returns Configured data table definition for applications
   */
  private defineApplicationsTable(): DataTableDefinition<Application, Application> {
    return DataTableDefinition.builder<Application, Application>(this.dialog, this.errorHandler, this.loadingService)
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getRouterLinkColumnDef('common.form.name', 'name', '/application/:id/applicationForm', {id: 'id'}),
        this.utils.getStatusColumnDef()
      ])
      .withRelationsOrder('name')
      .withRelationsFetcher(() => {
        if (this.isNewOrDuplicated() || !this.entityToEdit) {
          return of([]);
        }
        return this.entityToEdit.getRelationArrayEx(Application, 'availableApplications', {
          projection: 'view'
        });
      })
      .withRelationsUpdater(async (applications: (Application & Status)[]) => {
        await onUpdatedRelation(applications).forAll(item =>
          this.entityToEdit.substituteAllRelation('availableApplications', item)
        );
      })
      .withTargetsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getNonEditableColumnDef('common.form.name', 'name'),
      ])
      .withTargetsOrder('name')
      .withTargetsFetcher(() => this.applicationService.fetchAllItems())
      .withTargetInclude((relations) => (target) =>
        !relations.some((relation) => relation.id === target.id)
      )
      .withTargetToRelation((items) => items)
      .withTargetsTitle('entity.permissionGroup.applications.header')
      .build();
  }

  /**
   * Defines the data table configuration for managing tree roles.
   * Sets up columns, data fetching, updating logic, and target selection.
   *
   * @returns Configured data table definition for roles
   */
  private defineRolesTable(): DataTableDefinition<Role, Role> {
    return DataTableDefinition.builder<Role, Role>(this.dialog, this.errorHandler, this.loadingService)
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getRouterLinkColumnDef('common.form.name', 'name', '/role/:id/roleForm', {id: 'id'}),
        this.utils.getStatusColumnDef()
      ])
      .withRelationsOrder('name')
      .withRelationsFetcher(() => {
        if (this.isNewOrDuplicated() || !this.entityToEdit) {
          return of([]);
        }
        return this.entityToEdit.getRelationArrayEx(Role, 'availableRoles', {
          projection: 'view'
        });
      })
      .withRelationsUpdater(async (roles: (Role & Status)[]) => {
        await onUpdatedRelation(roles).forAll(item =>
          this.entityToEdit.substituteAllRelation('availableRoles', item)
        );
      })
      .withTargetsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getNonEditableColumnDef('common.form.name', 'name'),
      ])
      .withTargetsOrder('name')
      .withTargetsFetcher(() => this.roleService.fetchAllItems())
      .withTargetInclude((relations) => (target) =>
        !relations.some((relation) => relation.id === target.id)
      )
      .withTargetToRelation((items) => items)
      .withTargetsTitle('entity.tree.roles')
      .build();
  }

}
