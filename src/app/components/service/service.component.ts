import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';

import {TranslateService} from '@ngx-translate/core';
import {firstValueFrom, of} from 'rxjs';

import {BaseListComponent} from "@app/components/base-list.component";
import {EntityListConfig} from "@app/components/shared/entity-list";
import {Configuration} from "@app/core/config/configuration";
import {createPagedInfiniteFetcher} from "@app/core/hal";
import {INFINITE_PAGE_SIZE_DEFAULT} from "@app/core/hal/infinite-page-size";
import {CodeListService, Service, ServiceAccessSummary, ServiceService, TranslationService,} from '@app/domain';
import {ErrorHandlerService} from '@app/services/error-handler.service';
import {LoadingOverlayService} from '@app/services/loading-overlay.service';
import {LoggerService} from '@app/services/logger.service';
import {UtilsService} from '@app/services/utils.service';

import {accessStatusLabel as statusLabel, renderAccessStatus} from './service-access-trend';
import {ServiceHealth, ServiceHealthFilterComponent} from './service-health-filter.component';

@Component({
    selector: 'app-service',
    templateUrl: './service.component.html',
    styles: [],
    standalone: false
})
export class ServiceComponent extends BaseListComponent<Service> {
  health: ServiceHealth | null = null;
  private readonly accessByServiceId = new Map<number, ServiceAccessSummary>();
  entityListConfig: EntityListConfig<Service> = {
    entityLabel: Configuration.SERVICE.labelPlural,
    iconName: Configuration.SERVICE.icon,
    font: Configuration.SERVICE.font,
    columnDefs: [],
    dataFetchFn: () => of([]),
    defaultColumnSorting: ['name'],
    gridComponents: {serviceHealthFilter: ServiceHealthFilterComponent},
    rowModelMode: 'infinite',
    pageSize: INFINITE_PAGE_SIZE_DEFAULT,
    infiniteBlockFetcher: createPagedInfiniteFetcher(this.serviceService, {
      params: () => this.health ? [{key: 'health', value: this.health}] : [],
    }),
    progressiveLocalFilter: false,
    backendSearch: true,
    gridOptions: {
      globalSearch: true,
      discardChangesButton: false,
      redoButton: false,
      undoButton: false,
      applyChangesButton: false,
      deleteButton: true,
      newButton: true,
      actionButton: true,
      hideReplaceButton: true
    }
  };

  constructor(
    protected override dialog: MatDialog,
    protected override translateService: TranslateService,
    protected override translationService: TranslationService,
    protected override codeListService: CodeListService,
    protected override loggerService: LoggerService,
    protected override errorHandler: ErrorHandlerService,
    protected override activatedRoute: ActivatedRoute,
    protected override utils: UtilsService,
    protected override router: Router,
    protected override loadingOverlay: LoadingOverlayService,
    public serviceService: ServiceService
  ) {
    super(
      dialog,
      translateService,
      translationService,
      codeListService,
      loggerService,
      errorHandler,
      activatedRoute,
      utils,
      router,
      loadingOverlay
    );
    const initial = this.activatedRoute.snapshot.queryParamMap.get('health');
    if (initial === 'failing' || initial === 'healthy' || initial === 'unchecked') {
      this.health = initial;
    }
  }

  /** The status column filter reloads the grid after this; the fetcher reads `health`. */
  setHealth(value: string | null): void {
    this.health = value === 'failing' || value === 'healthy' || value === 'unchecked' ? value : null;
    void this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {health: this.health},
      queryParamsHandling: 'merge',
    });
  }

  override async preFetchData(): Promise<void> {
    await this.initCodeLists(['databaseConnection.driver']);
  }

  override async postFetchData(): Promise<void> {
    let summaries: ServiceAccessSummary[] = [];
    try {
      const loaded = await firstValueFrom(this.serviceService.accessSummaries());
      summaries = Array.isArray(loaded) ? loaded : [];
    } catch (error) {
      this.loggerService.warn('Service access summaries unavailable', error);
      summaries = [];
    }
    this.accessByServiceId.clear();
    for (const summary of summaries) {
      this.accessByServiceId.set(summary.serviceId, summary);
    }

    const nameCol: any = this.utils.getRouterLinkColumnDef('common.form.name', 'name', 'service/:id/serviceForm', {id: 'id'}, 160);
    nameCol.sortable = true;
    nameCol.cellRendererParams = {...nameCol.cellRendererParams, sortField: 'name'};
    nameCol.flex = 6;
    nameCol.tooltipField = 'name';

    const typeCol: any = this.utils.getNonEditableColumnDef('common.form.type', 'type');
    typeCol.sortable = true;
    typeCol.cellRendererParams = {sortField: 'type'};
    // "WMTS" (~32px) plus 48px cell padding and the sort icon. No flex share of the row.
    typeCol.flex = 0;
    typeCol.width = 108;
    typeCol.minWidth = 80;
    typeCol.resizable = true;

    const endpointCol: any = this.utils.getNonEditableColumnWithLinkDef('entity.service.endpoint', 'serviceURL', 160);
    endpointCol.flex = 4;
    endpointCol.cellClass = 'read-only-cell sitmun-technical-cell';
    endpointCol.tooltipField = 'serviceURL';

    const statusCol: any = this.utils.getNonEditableColumnDef('entity.service.accessStatus', 'accessStatus');
    statusCol.sortable = true;
    statusCol.cellRendererParams = {sortField: 'accessRank'};
    statusCol.cellRenderer = (params) => params.data
      ? renderAccessStatus(
        this.accessFor(params.data.id)?.status,
        this.accessStatusLabel(this.accessFor(params.data.id)?.status),
      )
      : '';
    statusCol.cellClass = 'read-only-cell sitmun-access-status-cell';
    statusCol.filter = 'serviceHealthFilter';
    statusCol.headerClass = 'sitmun-access-status-header';
    statusCol.icons = {menu: '<span class="ag-icon ag-icon-filter" role="presentation"></span>'};
    statusCol.filterParams = {
      health: () => this.health,
      onHealth: (value: ServiceHealth | null) => this.setHealth(value),
      options: (['all', 'failing', 'healthy', 'unchecked'] as const).map((id) => ({
        id,
        label: this.translateService.instant(`entity.service.health.${id}`),
      })),
    };
    // 14px dot, 4px halo, 10px gap, "Request error" (13×8px), 48px cell padding. No flex share of the row.
    statusCol.flex = 0;
    statusCol.width = 168;
    statusCol.minWidth = 112;
    statusCol.resizable = true;
    statusCol.valueGetter = (params) => this.accessStatusLabel(this.accessFor(params.data?.id)?.status);

    this.entityListConfig.columnDefs = [
      this.utils.getRowCheckboxColumnDef(),
      nameCol,
      typeCol,
      endpointCol,
      statusCol,
    ];
  }

  private accessFor(serviceId: number | undefined): ServiceAccessSummary | undefined {
    if (serviceId == null) {
      return undefined;
    }
    return this.accessByServiceId.get(serviceId);
  }

  private accessStatusLabel(code: string | null | undefined): string {
    return statusLabel(code, (key) => this.translateService.instant(key));
  }

  override async newData() {
    await this.router.navigate(['service', -1, 'serviceForm']);
  }

  override async duplicateItem(id: number) {
    await this.router.navigate(['service', -1, 'serviceForm', id]);
  }

  override dataFetchFn = () => this.serviceService.fetchAllItems();

  override dataUpdateFn = (data: Service) => firstValueFrom(this.serviceService.update(data))

  override dataDeleteFn = (data: Service) => firstValueFrom(this.serviceService.delete(data))
}
