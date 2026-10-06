import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {MatChipInputEvent} from '@angular/material/chips';
import {MatDialog} from '@angular/material/dialog';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {ActivatedRoute, Router} from '@angular/router';

import {TranslateService} from "@ngx-translate/core";
import { firstValueFrom, of} from 'rxjs';
import {map} from 'rxjs/operators';

import {BaseFormComponent} from "@app/components/base-form.component";
import {DataTableDefinition, TemplateDialog} from "@app/components/data-tables.util";
import {Configuration} from "@app/core/config/configuration";
import {FeatureFlagService} from '@app/core/features/feature-flag.service';
import {MessagesInterceptorStateService} from "@app/core/interceptors/messages.interceptor";
import {
  Cartography,
  CartographyProjection,
  CartographyService,
  CartographyStyle,
  CartographyStyleService,
  CodeList,
  CodeListService,
  Service,
  ServiceAccessHour,
  ServiceAccessObservation,
  ServiceAccessSample,
  ServiceUsageApplicationTotal,
  ServiceUsageRange,
  ServiceUsageView,
  ServiceCapabilitiesProbe,
  ServiceParameter,
  ServiceParameterService,
  ServiceService,
  TranslationService,
} from '@app/domain';
import {DataSeries} from '@app/frontend-gui/src/lib/data-graph/datagraph.component';
import {
  DialogMessageComponent,
  onCreate,
  onDelete,
  onNotAvailable,
  onPendingRegistration,
  onUpdate,
  Status
} from '@app/frontend-gui/src/lib/public_api';
import {ErrorHandlerService} from "@app/services/error-handler.service";
import {LoadingOverlayService} from "@app/services/loading-overlay.service";
import {LoggerService} from '@app/services/logger.service';
import {UtilsService} from '@app/services/utils.service';
import {WMSCapabilitiesService, WMSLayersCapabilities} from "@app/services/wms-capabilities.service";
import { compareNullableString } from '@app/utils/compare-nullable-string';
import {config} from '@config';
import {constants} from '@environments/constants';

import {
  accessDetailRequest,
  accessDetailSentence,
  accessSinceLabel,
  AVAILABILITY_TARGET_PERCENT,
  monitoringFacts,
  operationErrorPercent as readOperationErrorPercent,
  recentAccessChanges,
  TIMEOUT_STATUS,
  usageAsOfClock,
  usageFacts as readUsageFacts,
  type AccessChange,
  type MonitoringFacts,
  type UsageFacts,
} from '../service-access-detail';
import {
  accessObserverLabel,
  accessStatusLabel,
  accessTrendSlots,
  bucketStart,
  healthyAccessStatus,
  hourColor,
  hourMinute,
  mergeBackendObservation,
} from '../service-access-trend';

@Component({
    selector: 'app-service-form',
    templateUrl: './service-form.component.html',
    styleUrls: ['./service-form.component.scss'],
    standalone: false
})
export class ServiceFormComponent extends BaseFormComponent<Service> implements OnInit, OnDestroy {

  readonly config = Configuration.SERVICE;

  private static readonly AUTHENTICATION_MODE_NONE = 'None';

  get serviceAuthenticationModes() {
    return this.codeList('service.authenticationMode').filter(m => m.value !== 'API key');
  }

  /** Whether the SITMUN proxy toggle is enabled. */
  isProxyEnabled(): boolean {
    return Boolean(this.entityForm?.get('isProxied')?.value);
  }

  private hasOriginAuthentication(mode: string | null | undefined = this.entityForm?.get('authenticationMode')?.value): boolean {
    return mode != null && mode !== '' && mode !== ServiceFormComponent.AUTHENTICATION_MODE_NONE;
  }

  /**
   * Flag indicating if projections can be removed from the service.
   * Always true as projections are user-manageable.
   * Controls the display of remove buttons in projection chips.
   */
  protected readonly canRemoveProjections = true;

  /**
   * Flag indicating if projections should be added when input loses focus.
   * Always true to support both manual entry and chip-based input.
   * Enhances user experience by allowing flexible input methods.
   */
  protected readonly addProjectionsOnBlur = true;

  /**
   * Array of key codes that trigger projection separation in the input.
   * Includes ENTER and COMMA for flexible input options.
   * Allows users to add projections using keyboard shortcuts.
   */
  protected readonly separatorKeysCodesForProjections: number[] = [ENTER, COMMA];

  /**
   * Data table configuration for managing service layers.
   * Handles WMS layer configurations and capabilities.
   * Defines columns, data fetching, and update operations for layers.
   */
  protected readonly layersTable: DataTableDefinition<CartographyProjection, CartographyProjection>;

  /**
   * Data table configuration for managing service parameters.
   * Handles parameter CRUD operations and validation.
   * Defines columns, data fetching, and update operations for parameters.
   */
  protected readonly parametersTable: DataTableDefinition<ServiceParameter, ServiceParameter>;

  accessObservation: ServiceAccessObservation | null = null;
  usageRange: ServiceUsageRange = '30d';
  usage: ServiceUsageView | null = null;
  usageOperationColumns = ['operation', 'requests', 'failed', 'errorRate'];
  usageApplicationColumns = ['name', 'requests', 'viewerLoads'];
  private usageRequested = false;
  private usageChart: {view: ServiceUsageView | null; lang: string; series: DataSeries[]} | null = null;

  accessHours = accessTrendSlots(undefined, 'tenMinute');
  accessSamples: ServiceAccessSample[] = [];
  sampleTimeoutMs = 0;
  private latencyChart: {
    samples: ServiceAccessSample[];
    timeoutMs: number;
    lang: string;
    series: DataSeries[];
    reference: {value: number} | null;
  } | null = null;
  readonly availabilityTarget = AVAILABILITY_TARGET_PERCENT;

  /**
   * Flag indicating if the WMS capabilities table load button is disabled.
   * True when service type is not WMS, false otherwise.
   * Used to control the visibility and interactivity of WMS-specific functionality.
   */
  private tableLoadButtonDisabled = true;

  /**
   * Stores the WMS layers capabilities data retrieved from the service.
   * Contains layer information, styles, and other metadata for WMS services.
   * Used to populate the layers data table and synchronize with the backend.
   */
  private wmsLayersCapabilities: WMSLayersCapabilities = new WMSLayersCapabilities();

  /** Avoid duplicate `dataTables.register` and skip parameters in `saveAll` when the tab is hidden. */
  private parametersTableRegisteredWithRegistry = false;

  /**
   * Reference to the parameter dialog template.
   * Used when opening the dialog for adding new parameters.
   * Provides a user-friendly interface for parameter creation.
   */
  @ViewChild('newParameterDialog', {static: true})
  private readonly newParameterDialog: TemplateRef<any>;

  /**
   * Creates an instance of ServiceFormComponent.
   * @param dialog - Service for managing Material dialogs
   * @param translateService - Service for translation functionality
   * @param translationService - Service for entity translation management
   * @param codeListService - Service for managing code lists
   * @param errorHandler - Service for error handling and display
   * @param activatedRoute - Service for accessing route parameters
   * @param router - Angular router service for navigation
   * @param loadingService
   * @param messagesInterceptorState
   * @param loadingService
   * @param messagesInterceptorState
   * @param utils - Utility service for common functions
   * @param cartographyService - Service for managing cartography entities
   * @param serviceParameterService - Service for managing service parameters
   * @param cartographyStyleService - Service for managing cartography styles
   * @param wmsCapabilitiesService - Service for retrieving WMS capabilities
   * @param loggerService - Service for logging
   * @param serviceService - Service for managing service entities
   */
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
    public cartographyService: CartographyService,
    public serviceParameterService: ServiceParameterService,
    public cartographyStyleService: CartographyStyleService,
    public wmsCapabilitiesService: WMSCapabilitiesService,
    private readonly serviceService: ServiceService,
    private readonly featureFlagService: FeatureFlagService,
  ) {
    super(dialog, translateService, translationService, codeListService, loggerService, errorHandler, activatedRoute, router, loadingService, messagesInterceptorState);
    this.layersTable = this.defineLayersTable();
    this.parametersTable = this.defineParametersTable();
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.featureFlagService.featureFlags$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.maybeRegisterParametersTable());
    this.loadUsage(this.usageRange);
  }

  /**
   * Prepares component data before fetching the entity.
   * Initializes translations, registers data tables, and loads code lists.
   *
   * @returns Promise that resolves when initialization is complete
   */
  override async preFetchData() {
    this.dataTables.register(this.layersTable);
    this.maybeRegisterParametersTable();
    this.initTranslations('Service', ['description', 'name'])
    await this.initCodeLists(['service.type', 'service.authenticationMode', 'serviceParameter.type'])
  }

  private maybeRegisterParametersTable(): void {
    if (!this.featureFlagService.isFeatureEnabled('SERVICES_PARAMETERS_FEATURE') || this.parametersTableRegisteredWithRegistry) {
      return;
    }
    this.dataTables.register(this.parametersTable);
    this.parametersTableRegisteredWithRegistry = true;
  }

  /**
   * Fetches the original entity by ID for editing.
   *
   * @returns Promise resolving to the service entity
   */
  override async fetchOriginal(): Promise<Service> {
    return firstValueFrom(this.serviceService.get(this.entityID));
  }

  /**
   * Creates a copy of an existing entity for duplication.
   * Prefixes the name with "copy_" to distinguish it from the original.
   *
   * @returns Promise resolving to the duplicated service entity
   */
  override async fetchCopy(): Promise<Service> {
    return firstValueFrom(this.serviceService.get(this.duplicateID).pipe(map((copy: Service) => {
      copy.name = this.translateService.instant("common.copyPrefix") + copy.name;
      return copy;
    })));
  }

  /**
   * Creates an empty service entity with default values.
   * Sets default authentication mode from code list.
   *
   * @returns New empty service entity
   */
  override empty(): Service {
    const defaultAuthMode = this.defaultValueOrNull('service.authenticationMode');
    return Object.assign(new Service(), {
      blocked: false,
      isProxied: false,
      supportedSRS: [],
      authenticationMode: defaultAuthMode?.value || null
    })
  }

  /**
   * Fetches related data for the service entity.
   * Loads translations for the current entity.
   *
   * @returns Promise that resolves when related data is loaded
   */
  override async fetchRelatedData(): Promise<void> {
    await this.loadTranslations(this.entityToEdit)
  }

  /**
   * Initializes the form after entity data is fetched.
   * Sets up reactive form with entity values and validation rules.
   * Configures the table load button state based on service type.
   *
   * @throws Error if entity is undefined
   */
  override postFetchData() {
    if (!this.entityToEdit) {
      throw new Error('Cannot initialize form: entity is undefined');
    }

    this.entityForm = new UntypedFormGroup({
      name: new UntypedFormControl(this.entityToEdit.name, [Validators.required, Validators.maxLength(60)]),
      user: new UntypedFormControl(this.entityToEdit.user),
      password: new UntypedFormControl(this.entityToEdit.password),
      authenticationMode: new UntypedFormControl(this.entityToEdit.authenticationMode, [Validators.required]),
      description: new UntypedFormControl(this.entityToEdit.description, [Validators.maxLength(4000)]),
      type: new UntypedFormControl(this.entityToEdit.type, [
        Validators.required,
      ]),
      serviceURL: new UntypedFormControl(this.entityToEdit.serviceURL, [
        Validators.required,
      ]),
      proxyUrl: new UntypedFormControl(this.entityToEdit.proxyUrl,),
      supportedSRS: new UntypedFormControl(this.entityToEdit.supportedSRS),
      getInformationURL: new UntypedFormControl(this.entityToEdit.getInformationURL,),
      blocked: new UntypedFormControl(this.entityToEdit.blocked, []),
      isProxied: new UntypedFormControl(this.entityToEdit.isProxied, []),
    });

    this.initAuthImpliesProxy();

    const currentType = this.findInCodeList('service.type', this.entityToEdit.type);
    this.tableLoadButtonDisabled = currentType ? currentType.value !== config.capabilitiesRequest.WMSIdentificator : false;
    this.refreshAccessTrend();
    this.loadStoredAccessObservation();
  }

  /** Auth other than None forces proxied on; turning proxy off while auth is set snaps it back. */
  private initAuthImpliesProxy(): void {
    this.applyAuthImpliesProxy(this.entityForm.get('authenticationMode')!.value);

    this.entityForm.get('authenticationMode')!.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(mode => this.applyAuthImpliesProxy(mode));

    this.entityForm.get('isProxied')!.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(isProxied => {
        if (!isProxied && this.hasOriginAuthentication()) {
          this.entityForm.get('isProxied')!.setValue(true, {emitEvent: false});
        }
      });
  }

  private applyAuthImpliesProxy(mode: string): void {
    if (this.hasOriginAuthentication(mode)) {
      this.entityForm.get('isProxied')!.setValue(true, {emitEvent: false});
    }
  }

  private capabilitiesProbe(): ServiceCapabilitiesProbe {
    const raw = this.entityForm.getRawValue();
    const probe: ServiceCapabilitiesProbe = {
      url: raw.serviceURL,
      type: raw.type,
      authenticationMode: raw.authenticationMode,
      user: raw.user,
    };
    if (this.entityID >= 1) {
      probe.id = this.entityID;
    }
    if (raw.password) {
      probe.password = raw.password;
    }
    return probe;
  }

  /**
   * Creates a Service object from the current form values.
   * Combines form data with entity data to create a complete service object.
   *
   * @param id - Optional ID for the new object, used when updating
   * @returns New Service instance populated with form values
   */
  createObject(id: number = null): Service {
    let safeToEdit = Service.fromObject(this.entityToEdit);
    const formValues = this.entityForm.getRawValue();
    safeToEdit = Object.assign(safeToEdit,
      formValues,
      {
        id: id,
      });
    return safeToEdit;
  }

  /**
   * Creates a new service entity in the database.
   * Creates the service using form values and returns the ID of the created entity.
   *
   * @returns Promise resolving to the ID of the created entity
   */
  override async createEntity(): Promise<number> {
    const entityToCreate = this.createObject();
    const entityCreated = await firstValueFrom(this.serviceService.create(entityToCreate));
    return entityCreated.id;
  }

  /**
   * Updates an existing service entity with form values.
   * Calls the service update API to persist the changes.
   *
   * @returns Promise that resolves when the update is complete
   */
  override async updateEntity() {
    const entityToUpdate = this.createObject(this.entityID);
    await firstValueFrom(this.serviceService.update(entityToUpdate));
  }

  /**
   * Updates related data after the main entity is saved.
   * Saves translations for the service entity.
   *
   * @param _isDuplicated - Whether this is a duplication operation
   * @returns Promise that resolves when all related updates are complete
   */
  override async updateDataRelated(_isDuplicated: boolean): Promise<void> {
    const entityToUpdate = this.createObject(this.entityID);
    await this.saveTranslations(entityToUpdate);
  }

  /**
   * Validates if the form can be saved.
   * Checks if all required form fields are valid.
   *
   * @returns True if the form is valid, false otherwise
   */
  override canSave(): boolean {
    return this.entityForm.valid;
  }

  /**
   * Appends the new projection to the existing list of supported SRS values.
   * Trims the input value and adds it to the supportedSRS array.
   *
   * @param event - The chip input event containing the new projection value
   */
  addProjection(event: MatChipInputEvent): void {
    const value = event.value;
    if ((value || '').trim()) {
      const srs = this.entityForm.get('supportedSRS').value;
      const newSrs = [...srs]
      newSrs.push(value.trim());
      this.entityForm.get('supportedSRS').setValue(newSrs)
    }
  }

  /**
   * Filters out the specified projection from the list of supported SRS values.
   * Removes the projection from the supportedSRS array if found.
   *
   * @param projection - The projection string to remove
   */
  removeProjection(projection: string): void {
    const srs = this.entityForm.get('supportedSRS').value;
    const index = srs.indexOf(projection);
    if (index >= 0) {
      const newSrs = [...srs]
      newSrs.splice(index, 1);
      this.entityForm.get('supportedSRS').setValue(newSrs)
    }
  }

  /**
   * Checks if the current service is a WMS type service.
   * Used to enable/disable WMS-specific functionality in the UI.
   *
   * @returns True if service type is WMS, false otherwise
   */
  isWMS() {
    return this.entityForm?.value.type === constants.codeValue.serviceType.wms
  }

  testAccess(): void {
    this.serviceService
      .accessCheck(this.entityID)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (observation) => {
          this.accessObservation = observation;
          this.refreshAccessTrend(observation);
        },
        error: (error) => this.errorHandler.handleError(error, 'common.error.loadingFailed'),
      });
  }

  private loadStoredAccessObservation(): void {
    if (this.entityID < 1) {
      return;
    }
    this.serviceService.accessSummaries()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (summaries) => {
          if (this.accessObservation != null) {
            return;
          }
          const stored = (Array.isArray(summaries) ? summaries : [])
            .find((summary) => summary.serviceId === this.entityID);
          if (!stored) {
            return;
          }
          this.accessObservation = {
            status: stored.status,
            statusRank: stored.statusRank,
            observer: stored.observer,
            elapsedMs: stored.elapsedMs,
            observedAt: stored.observedAt,
            detail: stored.detail,
          };
        },
        error: (error) => this.loggerService.warn('Stored service access unavailable', error),
      });
  }

  private refreshAccessTrend(observation?: ServiceAccessObservation): void {
    const paint = (buckets: Array<ServiceAccessHour | null> | null | undefined) => {
      this.accessHours = mergeBackendObservation(
        accessTrendSlots(buckets, 'tenMinute'),
        observation,
        'tenMinute',
      );
    };

    if (this.entityID < 1) {
      paint(observation ? this.accessHours : undefined);
      return;
    }

    this.loadAccessSamples();
    this.serviceService.accessTrend(this.entityID)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (trend) => paint(trend.buckets),
        error: (error) => {
          this.loggerService.warn('Service access trend unavailable', error);
          paint(this.accessHours);
        },
      });
  }

  onServiceTab(event: MatTabChangeEvent): void {
    const usageLabel = this.translateService.instant('entity.service.usage.title');
    if (event.tab.textLabel !== usageLabel || this.entityID < 1 || this.usageRequested) {
      return;
    }
    this.usageRequested = true;
    this.loadUsage(this.usageRange);
  }

  accessObserverText(observer: string | null | undefined): string {
    return accessObserverLabel(observer, (key) => this.translateService.instant(key));
  }

  accessStatusText(code: string | null | undefined): string {
    return accessStatusLabel(code, (key) => this.translateService.instant(key));
  }

  accessDetailText(detail: string | null | undefined): string {
    return accessDetailSentence(detail, (key) => this.translateService.instant(key));
  }

  monitoring(): MonitoringFacts | null {
    return monitoringFacts(this.accessObservation, this.accessHours, this.accessSamples, new Date());
  }

  accessVerdictText(facts: MonitoringFacts): string {
    if (facts.status !== TIMEOUT_STATUS || this.sampleTimeoutMs <= 0) {
      return this.accessStatusText(facts.status);
    }
    return this.translateService.instant('entity.service.access.timedOutAfter', {seconds: this.timeoutSeconds()});
  }

  timedOutText(facts: MonitoringFacts): string {
    if (facts.timedOut === 0) {
      return '';
    }
    return facts.timedOut === 1
      ? this.translateService.instant('entity.service.access.timedOutOne')
      : this.translateService.instant('entity.service.access.timedOutCount', {count: facts.timedOut});
  }

  private timeoutSeconds(): string {
    return new Intl.NumberFormat(this.translateService.currentLang || 'es', {maximumFractionDigits: 1})
      .format(this.sampleTimeoutMs / 1000);
  }

  statusColor(status: string): string {
    return hourColor({status});
  }

  healthyStatus(status: string | null | undefined): boolean {
    return healthyAccessStatus(status);
  }

  accessClock(date: Date): string {
    return hourMinute(date);
  }

  accessAgo(since: Date): string {
    return relativeAgo(since, new Date(), this.translateService.currentLang || 'es');
  }

  checkedText(): string {
    return accessSinceLabel(this.accessObservation?.observedAt, this.translateService.currentLang || 'es');
  }

  changeClock(index: number): string {
    return hourMinute(bucketStart(index, new Date(), 'tenMinute'));
  }

  lastCheckText(facts: MonitoringFacts): string {
    const time = this.checkedText();
    const observer = this.accessObserverText(facts.observer);
    if (facts.status === TIMEOUT_STATUS && this.sampleTimeoutMs > 0) {
      return this.translateService.instant('entity.service.access.lastCheckTimeout', {
        time, observer, seconds: this.timeoutSeconds(),
      });
    }
    const elapsed = facts.elapsedMs ?? '';
    const key = 'entity.service.access.lastCheck';
    const translated = this.translateService.instant(key, {time, observer, elapsed});
    if (translated === key) {
      return `${time} · ${observer} · ${elapsed} ms`;
    }
    return translated;
  }

  /**
   * Trend buckets keep only status and observers; the request lives in the latest stored check,
   * so only the newest change can name it.
   */
  recentChanges(): Array<AccessChange & {what: string; failed: boolean; detail: boolean}> {
    return recentAccessChanges(this.accessHours).map((change, position) => {
      const failed = !healthyAccessStatus(change.to);
      const observers = change.observers.map((observer) => this.accessObserverText(observer)).join(', ');
      const detail = position === 0 && this.carriesDetail(change);
      const check = !detail ? '' : failed
        ? this.accessDetailText(this.accessObservation?.detail)
        : accessDetailRequest(this.accessObservation?.detail);
      return {...change, what: [check, observers].filter(Boolean).join(' · '), failed, detail};
    });
  }

  loneDetail(): boolean {
    if (this.accessObservation == null) {
      return false;
    }
    const latest = recentAccessChanges(this.accessHours, 1)[0];
    return !(latest && this.carriesDetail(latest));
  }

  trackChange(_position: number, change: AccessChange): number {
    return change.index;
  }

  private carriesDetail(change: AccessChange): boolean {
    return Boolean(this.accessObservation?.detail?.trim()) && this.accessObservation?.status === change.to;
  }

  /**
   * Same array while the samples, limit, and language are unchanged: a fresh array per
   * change detection makes the chart call setOption every frame.
   */
  latencySeries(): DataSeries[] {
    return this.rememberLatency().series;
  }

  latencyReference(): {value: number} | null {
    return this.rememberLatency().reference;
  }

  private rememberLatency(): NonNullable<ServiceFormComponent['latencyChart']> {
    const lang = this.translateService.currentLang;
    if (
      this.latencyChart?.samples !== this.accessSamples
      || this.latencyChart.timeoutMs !== this.sampleTimeoutMs
      || this.latencyChart.lang !== lang
    ) {
      this.latencyChart = {
        samples: this.accessSamples,
        timeoutMs: this.sampleTimeoutMs,
        lang,
        series: this.buildLatencySeries(),
        reference: this.buildLatencyReference(),
      };
    }
    return this.latencyChart;
  }

  /** A timeout has no response time: it breaks its observer's line and becomes a marker on the limit. */
  private buildLatencySeries(): DataSeries[] {
    const byObserver = new Map<string, DataSeries>();
    const timeouts: DataSeries = {
      name: this.accessStatusText(TIMEOUT_STATUS),
      kind: 'scatter',
      color: '#c62828',
      data: [],
    };
    for (const sample of this.accessSamples) {
      let series = byObserver.get(sample.observer);
      if (!series) {
        series = {
          name: this.accessObserverText(sample.observer),
          kind: 'line',
          color: sample.observer === 'proxy' ? '#009688' : '#1565c0',
          data: [],
        };
        byObserver.set(sample.observer, series);
      }
      const timedOut = sample.status === TIMEOUT_STATUS;
      series.data.push({index: sample.observedAt, value: timedOut ? null : sample.elapsedMs});
      if (timedOut) {
        timeouts.data.push({
          index: sample.observedAt,
          value: this.sampleTimeoutMs > 0 ? this.sampleTimeoutMs : sample.elapsedMs,
          note: this.translateService.instant('entity.service.access.timedOutAt', {
            time: hourMinute(new Date(sample.observedAt)),
            observer: this.accessObserverText(sample.observer),
          }),
        });
      }
    }
    return timeouts.data.length ? [...byObserver.values(), timeouts] : [...byObserver.values()];
  }

  private buildLatencyReference(): {value: number} | null {
    if (this.sampleTimeoutMs <= 0) {
      return null;
    }
    return {value: this.sampleTimeoutMs};
  }

  private loadAccessSamples(): void {
    if (this.entityID < 1) {
      return;
    }
    this.serviceService.accessSamples(this.entityID)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (body) => {
          this.accessSamples = body.samples ?? [];
          this.sampleTimeoutMs = body.timeoutMs ?? 0;
        },
        error: (error) => this.loggerService.warn('Service access samples unavailable', error),
      });
  }

  loadUsage(range: ServiceUsageRange): void {
    this.usageRange = range;
    if (this.entityID < 1) {
      return;
    }
    this.serviceService
      .usage(this.entityID, range)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (view) => {
          this.usage = view;
        },
        error: (error) => this.errorHandler.handleError(error, 'common.error.loadingFailed'),
      });
  }

  usageFacts(): UsageFacts | null {
    return readUsageFacts(this.usage);
  }

  usageRangeLabel(): string {
    switch (this.usageRange) {
      case '30d':
        return this.translateService.instant('entity.service.usage.range30');
      case '90d':
        return this.translateService.instant('entity.service.usage.range90');
      case '12m':
        return this.translateService.instant('entity.service.usage.range12m');
      default: {
        const unreachable: never = this.usageRange;
        return unreachable;
      }
    }
  }

  usageAsOfText(): string | null {
    return usageAsOfClock(this.usage?.asOf, this.translateService.currentLang || 'es');
  }

  usageDeltaText(percent: number): string {
    const magnitude = Math.abs(percent);
    if (percent > 0) {
      return `▲ ${magnitude} %`;
    }
    if (percent < 0) {
      return `▼ ${magnitude} %`;
    }
    return `${magnitude} %`;
  }

  operationErrorPercent(requests: number | null | undefined, failed: number | null | undefined): number | null {
    return readOperationErrorPercent(requests, failed);
  }

  usageErrorRateText(requests: number | null | undefined, failed: number | null | undefined): string {
    const percent = this.operationErrorPercent(requests, failed);
    if (percent == null) {
      return '';
    }
    return `${percent} %`;
  }

  formatCount(value: number | null | undefined): string {
    if (value == null) {
      return '';
    }
    return new Intl.NumberFormat(this.translateService.currentLang || 'es').format(value);
  }

  usageLastUsedText(): string {
    const day = this.usageFacts()?.lastUsedDay;
    if (day == null || day === '') {
      return this.translateService.instant('entity.service.usage.unused');
    }
    const now = new Date();
    const today = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0'),
    ].join('-');
    if (day === today) {
      return this.translateService.instant('entity.service.usage.today');
    }
    return day;
  }

  usageOperations() {
    return (this.usage?.operations ?? []).filter((row) => row.operation !== 'ViewerConfig');
  }

  usageSeries(): Array<{index: string; value: number | null}> {
    if (!this.usage?.measured || !this.usage.series) {
      return [];
    }
    return this.usage.series.map((point) => ({index: point.index, value: point.value}));
  }

  /**
   * Same array while the payload and language are unchanged: a fresh array per change
   * detection makes the chart call setOption every frame and restart its bar animation.
   */
  usageChartSeries(): DataSeries[] {
    const lang = this.translateService.currentLang;
    if (this.usageChart?.view !== this.usage || this.usageChart.lang !== lang) {
      this.usageChart = {view: this.usage, lang, series: this.buildUsageChartSeries()};
    }
    return this.usageChart.series;
  }

  usageChartPeriod(): 'day' | 'month' {
    return this.usageRange === '12m' ? 'month' : 'day';
  }

  usageChartTitleKey(): string {
    return this.usageChartPeriod() === 'month' ? 'entity.service.usage.perMonth' : 'entity.service.usage.perDay';
  }

  usageSlotsKey(): string {
    return this.usageChartPeriod() === 'month' ? 'entity.service.usage.monthsWithUse' : 'entity.service.usage.daysWithUse';
  }

  private buildUsageChartSeries(): DataSeries[] {
    const points = this.usage?.measured && this.usage.series ? this.usage.series : [];
    return [
      {
        name: this.translateService.instant('entity.service.usage.successful'),
        kind: 'bar',
        color: '#FF9300',
        data: points.map((point) => ({
          index: point.index,
          value: point.value == null ? null : Math.max(0, point.value - (point.failed ?? 0)),
        })),
      },
      {
        name: this.translateService.instant('entity.service.usage.failed'),
        kind: 'bar',
        color: '#c62828',
        data: points.map((point) => ({index: point.index, value: point.failed ?? 0})),
      },
    ];
  }

  usageChartTotalLabel(): string {
    return this.translateService.instant('entity.service.usage.requests');
  }

  usageChartLocale(): string {
    return this.translateService.currentLang || 'es';
  }

  usageApplications(): ServiceUsageApplicationTotal[] {
    return [...(this.usage?.applications ?? [])]
      .sort((left, right) => (right.requests ?? 0) - (left.requests ?? 0));
  }

  /**
   * Handles service type change events.
   * Enables/disables capabilities button based on service type.
   *
   * @param event - The change event containing the new service type value
   */
  onTypeChange(event: { value: string; }): void {
    this.tableLoadButtonDisabled = event.value != config.capabilitiesRequest.WMSIdentificator;
  }

  /**
   * Updates service metadata from WMS capabilities.
   * Opens a confirmation dialog before retrieving metadata.
   * Updates name, description, and supported projections after confirmation.
   */
  onUpdateServiceMetadata() {
    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title = this.utils.getTranslate('common.caution');
    dialogRef.componentInstance.message = this.utils.getTranslate('entity.service.getCapabilitiesMessage');
    dialogRef.afterClosed().subscribe(next => {
      if (next?.event === 'Accept') {
        if (this.entityForm.get('type').value === constants.codeValue.serviceType.wms) {
          this.wmsCapabilitiesService.processWMSServiceMetadata(this.capabilitiesProbe())
            .then((capabilities) => {
              this.entityForm.patchValue({
                name: capabilities.title?.substring(0, 60),
                description: capabilities.abstract?.substring(0, 4000),
                supportedSRS: capabilities.supportedSRS
              });
              this.applyCapabilitiesTranslations('name', capabilities.titleTranslations, 60);
              this.applyCapabilitiesTranslations('description', capabilities.abstractTranslations, 4000);
              // patchValue does not mark the form dirty; save is gated on dirty in canSaveEntity.
              this.entityForm.markAsDirty();
            })
            .catch((reason) => this.errorHandler.handleError(reason, 'entity.service.error.processCapabilities'));
        }
      }
    });
  }

  /**
   * Prefills translation rows from WMS capabilities alternate-language texts.
   *
   * @param property - Translatable entity property (`name` or `description`)
   * @param translations - Map of language shortname to capability text
   * @param maxLength - Maximum allowed length for the target field
   */
  private applyCapabilitiesTranslations(
    property: 'description' | 'name',
    translations: Map<string, string>,
    maxLength: number,
  ): void {
    const propertyTranslations = this.propertyTranslations.get(property);
    if (!propertyTranslations || translations.size === 0) {
      return;
    }

    let updated = false;
    translations.forEach((text, lang) => {
      const translationRow = propertyTranslations.map.get(lang);
      if (translationRow) {
        translationRow.translation = text.substring(0, maxLength);
        updated = true;
      }
    });

    if (updated) {
      propertyTranslations.modified = true;
    }
  }

  /**
   * Updates the service layers from WMS capabilities.
   * Opens a confirmation dialog before retrieving layer information.
   * Refreshes the layers table with the retrieved capabilities data.
   */
  onUpdateServiceCapabilities() {
    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title = this.utils.getTranslate('common.caution');
    dialogRef.componentInstance.message = this.utils.getTranslate('entity.service.getCapabilitiesMessage');
    dialogRef.afterClosed().subscribe(next => {
      if (next?.event === 'Accept') {
        if (this.entityForm.get('type').value === constants.codeValue.serviceType.wms) {
          this.wmsCapabilitiesService.processWMSServiceCapabilities(this.capabilitiesProbe())
            .then((response: WMSLayersCapabilities) => {
              this.wmsLayersCapabilities = response
              this.layersTable.saveCommandEvent$.next("save")
            })
            .catch((reason) => this.errorHandler.handleError(reason, 'entity.service.error.processCapabilities'));
        }
      }
    });
  }

  /**
   * Defines the data table configuration for managing layers.
   * Sets up columns, data fetching, updating logic, and synchronization with WMS capabilities.
   *
   * @returns Configured data table definition for layers
   */
  private defineLayersTable(): DataTableDefinition<CartographyProjection, CartographyProjection> {
    return DataTableDefinition.builder<CartographyProjection, CartographyProjection>(this.dialog, this.errorHandler, this.loadingService)
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        {
          ...this.utils.getRouterLinkColumnDef(
            'entity.service.layer.title',
            'name',
            '/layers/:id/layersForm',
            { id: 'id' },
            150
          ),
          flex: 2,
          minWidth: 150,
          editable: (params) => !params.data?.id,
        },
        Object.assign(this.utils.getNonEditableColumnDef('entity.service.layer.name', 'layers', 150), {flex: 3, minWidth: 180}),
        Object.assign(this.utils.getEditableColumnDef('entity.service.layer.abstract', 'description', 150), {flex: 2, minWidth: 150}),
        this.utils.getStatusColumnDef()
      ])
      .withRelationsOrder('name')
      .withRelationsFetcher(() => {
        if (this.wmsLayersCapabilities?.layers?.length === 0) {
          if (this.isNewOrDuplicated()) {
            return of([]);
          } else {
            return this.entityToEdit.getRelationArrayEx(CartographyProjection, 'layers', {projection: 'view'});
          }
        } else if (this.isNewOrDuplicated()) {
          // For new services, just return capabilities layers as unregistered
          return of(this.wmsLayersCapabilities.layers.map(capabilityLayer =>
            Object.assign(new CartographyProjection(), capabilityLayer, {
              status: 'unregisteredLayer',
              newItem: true
            }) as CartographyProjection & Status
          ));
        } else {
          return this.entityToEdit.getRelationArrayEx(CartographyProjection, 'layers', {projection: 'view'})
            .pipe(map((currentLayers: (CartographyProjection & Status)[]) => {
              const finalCartographies: (CartographyProjection & Status)[] = [];
              const serviceLayers = new Set<string>();
              this.wmsLayersCapabilities.layers.forEach(capabilityLayer => {
                const layerName = capabilityLayer.layers[0];
                serviceLayers.add(layerName);

                const matchingLayers = currentLayers.some(layer =>
                  layer.layers.length == 1 && layer.layers.includes(layerName));
                if (!matchingLayers) {
                  // Layer from capabilities not found in current layers - mark as unregistered
                  const newLayer = Object.assign(new CartographyProjection(), capabilityLayer, {
                    status: 'unregisteredLayer',
                    newItem: true
                  }) as CartographyProjection & Status;
                  finalCartographies.push(newLayer);
                }
              });

              // Add any remaining layers that weren't found in capabilities as not available
              currentLayers.forEach(layer => {
                const allAvailable = layer.layers.every(layer => serviceLayers.has(layer))
                if (allAvailable) {
                  finalCartographies.push(layer)
                } else {
                  const unavailableLayer = Object.assign(new CartographyProjection(), layer, {
                    status: 'notAvailable'
                  }) as CartographyProjection & Status;
                  finalCartographies.push(unavailableLayer);
                }
              });
              return finalCartographies;
            }));
        }
      })
      .withRelationsUpdater(async (cartographies: (CartographyProjection & Status)[]) => {
        await onNotAvailable(cartographies).forEach(item => {
          item.blocked = true;
          return this.cartographyService.update(Cartography.fromObject(item))
        })
        const newCartographies = await onPendingRegistration(cartographies).forEach(item => {
          const newItem = Cartography.fromObject(item);
          newItem.service = this.entityToEdit;
          newItem.blocked = false;
          newItem.queryableFeatureAvailable = false;
          newItem.queryableFeatureEnabled = false;
          return this.cartographyService.create(newItem);
        }) as Cartography[];
        await Promise.all(newCartographies.flatMap(cartography => {
          if (this.wmsLayersCapabilities.styles.has(cartography.layers[0])) {
            const styles = this.wmsLayersCapabilities.styles.get(cartography.layers[0]);
            return styles.map(style => {
              const newStyle = Object.assign(new CartographyStyle(), style);
              newStyle.cartography = cartography;
              return newStyle;
            });
          } else {
            return []
          }
        }).map(async item => {
          const style = await firstValueFrom(this.cartographyStyleService.create(item))
          style.updateRelationEx("cartography", item.cartography)
        }))
        await onUpdate(cartographies).forEach(item => this.cartographyService.update(Cartography.fromObject(item)));
        await onDelete(cartographies).forEach(item => this.cartographyService.delete(Cartography.fromObject(item)));
      })
      .build();
  }

  /**
   * {@code serviceParameter.type} minus {@code service.type} values, except:
   * the service’s selected type (e.g. WMS on a WMS service), non-service codes (e.g. VARY), and the dialog’s current parameter type.
   * The service’s protocol type is listed first; remaining entries follow sorted by description.
   */
  private parameterTypesForNewParameterDialog(selectedParameterType: string | null | undefined): CodeList[] {
    const parameterTypes = this.codeList('serviceParameter.type');
    const serviceTypeValues = new Set(this.codeList('service.type').map((c) => c.value));
    const selectedServiceType = this.entityForm?.get('type')?.value ?? this.entityToEdit?.type ?? null;
    const filtered = parameterTypes.filter((pt) => {
      if (!serviceTypeValues.has(pt.value)) {
        return true;
      }
      return pt.value === selectedServiceType || pt.value === selectedParameterType;
    });
    return this.orderNewParameterTypesWithServiceTypeFirst(filtered, selectedServiceType);
  }

  /** Puts the service protocol type first when present; otherwise sorts by description. */
  private orderNewParameterTypesWithServiceTypeFirst(
    filtered: CodeList[],
    selectedServiceType: string | null | undefined,
  ): CodeList[] {
    const byDescription = (a: CodeList, b: CodeList) => compareNullableString(a.description, b.description);
    if (!selectedServiceType) {
      return [...filtered].sort(byDescription);
    }
    const primary = filtered.find((pt) => pt.value === selectedServiceType);
    const rest = filtered.filter((pt) => pt.value !== selectedServiceType).sort(byDescription);
    return primary ? [primary, ...rest] : [...filtered].sort(byDescription);
  }

  /** Options for the new-parameter dialog type control (see {@link parameterTypesForNewParameterDialog}). */
  newParameterDialogParameterTypes(): CodeList[] {
    const selected = this.parametersTable?.templateDialog('newParameterDialog')?.form?.get('type')?.value;
    return this.parameterTypesForNewParameterDialog(selected);
  }

  /**
   * Label for the parameters grid and dialog: ngx-translate when {@code entity.serviceParameter.typeLabel.*}
   * exists, otherwise codelist description (API / DB, may follow another language).
   */
  serviceParameterTypeDescription(type: string | undefined | null): string {
    if (type == null || type === '') {
      return '';
    }
    const key = `entity.serviceParameter.typeLabel.${type}`;
    const translated = this.translateService.instant(key);
    if (translated !== key) {
      return translated;
    }
    return this.findInCodeList('serviceParameter.type', type)?.description ?? type;
  }

  /**
   * Defines the data table configuration for managing service parameters.
   * Sets up columns, data fetching, updating logic, and dialog templates.
   *
   * @returns Configured data table definition for parameters
   */
  private defineParametersTable(): DataTableDefinition<ServiceParameter, ServiceParameter> {
    return DataTableDefinition.builder<ServiceParameter, ServiceParameter>(this.dialog, this.errorHandler, this.loadingService)
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        Object.assign(this.utils.getEditableColumnDef('common.form.name', 'name', 150), {flex: 1, minWidth: 140}),
        Object.assign(this.utils.getEditableColumnDef('common.form.value', 'value', 150), {flex: 2, minWidth: 160}),
        Object.assign(this.utils.getNonEditableColumnDef('common.form.type', 'typeDescription', 150), {flex: 0, minWidth: 120}),
        this.utils.getStatusColumnDef()
      ])
      .withRelationsOrder('name')
      .withRelationsFetcher(() => {
        if (this.isEdition()) {
          return this.entityToEdit.getRelationArrayEx(ServiceParameter, 'parameters')
            .pipe(map(data => data.map(element => Object.assign(new ServiceParameter(), {
              ...element,
              typeDescription: this.serviceParameterTypeDescription(element.type)
            }))))
        } else {
          return of([]);
        }
      })
      .withRelationsUpdater(async (parameters: (ServiceParameter & Status)[]) => {
        await onCreate(parameters).forEach(item => this.serviceParameterService.create(Object.assign(new ServiceParameter(), {
          ...item,
          service: this.entityToEdit
        })))
        await onUpdate(parameters).forEach(item => this.serviceParameterService.update(Object.assign(new ServiceParameter(), {
          ...item,
          service: this.entityToEdit
        })))
        await onDelete(parameters).forEach(item => this.serviceParameterService.delete(item))
      })
      .withTemplateDialog('newParameterDialog', () => TemplateDialog.builder()
        .withReference(this.newParameterDialog)
        .withTitle('entity.service.newParameter')
        .withForm(
          new UntypedFormGroup({
            name: new UntypedFormControl('', [Validators.required, Validators.maxLength(50)]),
            type: new UntypedFormControl('', [Validators.required]),
            value: new UntypedFormControl('', [Validators.maxLength(250)]),
          })
        ).withPreOpenFunction((form: UntypedFormGroup) => {
          const allowed = this.parameterTypesForNewParameterDialog(null);
          const initialType = allowed[0]?.value ?? null;
          form.reset({name: '', type: initialType, value: ''});
        }).build())
      .withTargetToRelation((items: ServiceParameter[]) =>
        items.map((item) =>
          Object.assign(new ServiceParameter(), item, {
            typeDescription: this.serviceParameterTypeDescription(item.type),
          }),
        ),
      )
      .build();
  }
}

function relativeAgo(since: Date, now: Date, locale: string): string {
  const rtf = new Intl.RelativeTimeFormat(locale, {numeric: 'auto'});
  const seconds = Math.round((since.getTime() - now.getTime()) / 1000);
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ['year', 60 * 60 * 24 * 365],
    ['month', 60 * 60 * 24 * 30],
    ['week', 60 * 60 * 24 * 7],
    ['day', 60 * 60 * 24],
    ['hour', 60 * 60],
    ['minute', 60],
  ];
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) {
      return rtf.format(Math.round(seconds / size), unit);
    }
  }
  return rtf.format(seconds, 'second');
}
