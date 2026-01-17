import {Component, ViewChild} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {ActivatedRoute, Router} from '@angular/router';


import {TranslateService} from '@ngx-translate/core';
import {firstValueFrom,map, of} from 'rxjs';

import {BaseFormComponent} from '@app/components/base-form.component';
import {DataTableDefinition} from '@app/components/data-tables.util';
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
  TreeService
} from '@app/domain';
import {onUpdatedRelation, Status} from '@app/frontend-gui/src/lib/public_api';
import {ErrorHandlerService} from '@app/services/error-handler.service';
import {LoadingOverlayService} from "@app/services/loading-overlay.service";
import {LoggerService} from '@app/services/logger.service';
import {UtilsService} from '@app/services/utils.service';

import {TreeNodesComponent} from './tree-nodes/tree-nodes.component';

@Component({
  selector: 'app-trees-form',
  templateUrl: './trees-form.component.html',
  styleUrls: ['./trees-form.component.scss']
})
export class TreesFormComponent extends BaseFormComponent<Tree> {
  readonly config = Configuration.TREE;

  currentTreeType: string;
  @ViewChild('treeNodesComponent') treeNodesComponent: TreeNodesComponent;
  @ViewChild('applicationsGrid') applicationsGrid: any;

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


  /**
   * Prepares component data before fetching the entity.
   * Initializes translations and loads code lists.
   *
   * @returns Promise that resolves when initialization is complete
   */
  override async preFetchData() {
    this.dataTables.register(this.applicationsTable);
    this.dataTables.register(this.rolesTable);
    this.initTranslations('tree', ['name', 'description']);
    await this.initCodeLists([
      'tree.type',
      'treenode.folder.type',
      'treenode.leaf.type',
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
        copy.name = this.translateService.instant('copy_') + copy.name;
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

    // Set default type for new trees
    if (this.isNew() && !this.entityToEdit.type) {
      const defaultType = this.defaultValueOrNull('tree.type');
      if (defaultType) {
        this.entityForm.patchValue({ type: defaultType.value });
        this.currentTreeType = defaultType.value;
      }
    }

    // Handle duplication
    if (this.isDuplicated()) {
      this.entityForm.patchValue({
        name: this.translateService.instant('copy_') + this.entityToEdit.name
      });
    }

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
    if (!this.treeValidations()) {
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
    } catch (error) {
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
    }
  }

  /**
   * Validates if the form can be saved.
   * Checks tree-specific validations in addition to form validity.
   *
   * @returns True if the form is valid and tree validations pass, false otherwise
   */
  override canSave(): boolean {
    return this.entityForm.valid && this.treeValidations();
  }

  /**
   * Computed property that determines if the save button should be enabled.
   * Extends base implementation to include tree node change detection.
   * 
   * @returns True if save button should be enabled, false otherwise
   */
  override get canSaveEntity(): boolean {
    // Include base checks (form dirty, data tables, translations)
    const baseCanSave = super.canSaveEntity;
    
    // Also check if tree nodes have unsaved changes
    const hasTreeNodeChanges = this.treeNodesComponent?.hasUnsavedChanges() ?? false;
    
    // Enable save if form is valid and any changes exist
    const isFormValid = this.entityForm?.valid ?? false;
    const hasAnyChanges = baseCanSave || (isFormValid && hasTreeNodeChanges);
    
    return hasAnyChanges && this.treeValidations();
  }

  /**
   * Receives nodes from tree nodes component for saving.
   * This method is called by the tree nodes component when save is requested.
   *
   * @param nodes - Array of tree nodes to save
   */
  receiveAllNodes(nodes: TreeNode[]) {
    if (nodes && nodes.length >= 0) {
      // Trigger save through base class
      this.onSaveButtonClicked();
    }
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
    this.currentTreeType = type;
  }

  activeImageNameInput(formtype: string, input: HTMLInputElement): void {
    this.entityForm.patchValue({
      image: null,
      imageName: null,
    });
    input.readOnly = false;
    input.focus();
  }

  removeImage(_formtype: string): void {
    this.entityForm.patchValue({
      image: null,
      imageName: null,
    });
  }

  onImageChange(formtype: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.readOnly) {
      this.entityForm.patchValue({
        image: input.value
      });
    }
  }

  onImageSelected(formtype: string, event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      if (!file.type.startsWith('image/')) {
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        this.entityForm.patchValue({
          image: reader.result,
          imageName: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  }

  treeValidations(): boolean {
    let valid = true;
    const nodes = this.treeNodesComponent?.getNodesForValidation() || [];
    const filterNodes = nodes.filter(a => (a as any).status !== 'pendingDelete');
    const validations = [{
      fn: this.validTreeForm,
      param: null,
      msg: this.utils.showRequiredFieldsError
    }, {
      fn: this.validTreeStructure,
      param: filterNodes,
      msg: this.utils.showTreeStructureError
    }];
    const error = validations.find(v => !v.fn.bind(this)(v.param));
    if (error) {
      valid = false;
      error.msg.bind(this.utils)();
    }
    return valid;
  }

  validTreeForm(): boolean {
    return this.entityForm.valid;
  }

  validTreeStructure(treeNodes: TreeNode[]): boolean {
    let valid = true;
    if (this.currentTreeType === this.codeValues.treeType.touristicTree) {
      const rootNode = treeNodes[0] as any;
      const rootNodes = rootNode.children.filter((n: any) => n.status !== 'pendingDelete');
      valid = rootNodes.length === 0 || (rootNodes.length === 1 && rootNodes[0].children.length > 0);
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
        this.utils.getIdColumnDef(),
        this.utils.getEditableColumnDef('treesEntity.name', 'name'),
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
        this.utils.getIdColumnDef(),
        this.utils.getNonEditableColumnDef('layersPermitsEntity.name', 'name'),
      ])
      .withTargetsOrder('name')
      .withTargetsFetcher(() => this.applicationService.getAll())
      .withTargetInclude((applications: Application[]) => (target: Application) => {
        // Prevent duplicates: filter out applications where target's name matches any existing relation's name
        // This preserves the original fieldRestrictionWithDifferentName behavior
        return !applications.some(app => app.name === target.name);
      })
      .withTargetsTitle('layersPermitsEntity.applications')
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
        this.utils.getIdColumnDef(),
        this.utils.getEditableColumnDef('roleEntity.name', 'name'),
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
        this.utils.getIdColumnDef(),
        this.utils.getNonEditableColumnDef('roleEntity.name', 'name'),
      ])
      .withTargetsOrder('name')
      .withTargetsFetcher(() => this.roleService.getAll())
      .withTargetsTitle('treesEntity.roles')
      .build();
  }

}
