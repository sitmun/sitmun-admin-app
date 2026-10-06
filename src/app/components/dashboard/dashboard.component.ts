import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger
} from '@angular/animations';
import {Component, OnInit} from '@angular/core';


import {TranslateService} from '@ngx-translate/core';
import {firstValueFrom, of} from 'rxjs';

import {accessStatusLabel, renderAccessStatus, renderAccessTrend} from '@app/components/service/service-access-trend';
import {renderServiceUsage} from '@app/components/service/service-usage-cell';
import {Configuration} from '@app/core/config/configuration';
import {DashboardService, ServiceService} from '@app/domain';
import {AffectedApplication, ServiceAccessSummary} from '@app/domain/service/models/service-access.model';
import {UtilsService} from '@app/services/utils.service';

interface AttentionRow {
  id: number;
  name: string;
  type: string;
  serviceURL: string;
  summary: ServiceAccessSummary;
}

const FILTER_MENU = {menu: '<span class="ag-icon ag-icon-filter" role="presentation"></span>'};

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [
        trigger('fadeIn', [
            transition(':enter', [
                style({ opacity: 0, transform: 'translateY(20px)' }),
                animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
            ])
        ]),
        trigger('listAnimation', [
            transition('* => *', [
                query(':enter', [
                    style({ opacity: 0, transform: 'translateY(20px)' }),
                    stagger(50, [
                        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
                    ])
                ], { optional: true })
            ])
        ])
    ],
    standalone: false
})
export class DashboardComponent implements OnInit {

  readonly config = Configuration.DASHBOARD;

  dataLoaded: boolean;

  KPIsTable: Array<{
    text: string;
    number: number;
    icon: string;
    tooltip: string;
    link?: string | any[] | null;
  }> = [];

  private readonly kpiIcons = {
    users: 'group',
    services: 'cloud_queue',
    tasks: 'assignment',
    territories: 'place',
    cartographies: 'layers',
    applications: 'apps',
    applicationsTerritories: 'account_tree'
  };

  healthCards: Array<{text: string; display: string; kind: 'failing' | 'unchecked' | 'healthy'; link: string; queryParams: Record<string, string>}> = [];
  healthMessage: string | null = null;
  freshMinutes: number | null = null;
  attention: AttentionRow[] = [];
  attentionColumnDefs: any[] = [];
  affectedColumnDefs: any[] = [];
  hasFailingServices = false;
  affectedApplications: AffectedApplication[] = [];
  readonly attentionFetch = () => of(this.attention);
  readonly affectedFetch = () => of(this.affectedApplications);
  readonly dashboardGrid = {
    readOnly: true,
    hideExportButton: true,
  };

  constructor(
    public utils: UtilsService,
    public dashboardService: DashboardService,
    private serviceService: ServiceService,
    private translateService: TranslateService,
    ) {
    this.attentionColumnDefs = this.buildAttentionColumns();
    this.affectedColumnDefs = this.buildAffectedColumns();
  }

  ngOnInit(): void {
    void (async () => {
      try {
        const result = await firstValueFrom(this.dashboardService.getAll());
        this.saveKPI(result);
        await this.loadHealth(result.total?.services ?? 0);
        this.dataLoaded = true;
      } catch (error) {
        console.error('Dashboard initialization failed:', error);
        this.dataLoaded = true;
      }
    })();
  }

  affectedStatus(): string {
    const used = this.affectedApplications.filter((row) => row.usage === 'used').length;
    const configured = this.affectedApplications.length - used;
    const usedLabel = used === 0
      ? this.translateService.instant('dashboard.affected.noneUsed')
      : this.translateService.instant('dashboard.affected.usedCount', {count: used});
    const configuredKey = configured === 0
      ? 'dashboard.affected.noneConfigured'
      : configured === 1
        ? 'dashboard.affected.configuredOne'
        : 'dashboard.affected.configuredMany';
    const configuredLabel = this.translateService.instant(configuredKey, {count: configured});
    return `${usedLabel} · ${configuredLabel}`;
  }

  private async loadHealth(serviceTotal: number): Promise<void> {
    try {
      const summaries = await firstValueFrom(this.serviceService.accessSummaries());
      const failing = summaries
        .filter((summary) => summary.statusRank > 10)
        .sort((left, right) => right.statusRank - left.statusRank || left.serviceId - right.serviceId);
      const services = await this.serviceIndex();
      const healthy = summaries.length - failing.length;
      const unchecked = Math.max(0, serviceTotal - summaries.length);
      const noneChecked = summaries.length === 0;
      this.hasFailingServices = failing.length > 0;
      this.freshMinutes = this.minutesSince(summaries);
      this.healthMessage = this.hasFailingServices
        ? null
        : noneChecked
          ? 'dashboard.health.noneChecked'
          : unchecked === 0
            ? 'dashboard.health.allOperational'
            : 'dashboard.attention.empty';
      const dash = '—';
      this.healthCards = [
        {text: this.utils.getTranslate('entity.service.health.failing'), display: noneChecked ? dash : String(failing.length), kind: 'failing', link: '/service', queryParams: {health: 'failing'}},
        {text: this.utils.getTranslate('entity.service.health.unchecked'), display: String(unchecked), kind: 'unchecked', link: '/service', queryParams: {health: 'unchecked'}},
        {text: this.utils.getTranslate('entity.service.health.healthy'), display: noneChecked ? dash : String(healthy), kind: 'healthy', link: '/service', queryParams: {health: 'healthy'}},
      ];
      this.attention = failing.map((summary) => {
        const service = services.get(summary.serviceId);
        return {
          id: summary.serviceId,
          name: service?.name ?? `#${summary.serviceId}`,
          type: service?.type ?? '',
          serviceURL: service?.serviceURL ?? '',
          summary,
        };
      });
      this.affectedApplications = this.hasFailingServices
        ? await firstValueFrom(this.serviceService.affectedApplications())
        : [];
    } catch (error) {
      console.error('Service health unavailable', error);
    }
  }

  private buildAttentionColumns(): any[] {
    const nameCol: any = this.utils.getRouterLinkColumnDef(
      'common.form.name', 'name', 'service/:id/serviceForm', {id: 'id'}, 160,
    );
    nameCol.flex = 0;
    nameCol.width = 300;

    const typeCol: any = this.utils.getNonEditableColumnDef('common.form.type', 'type');
    typeCol.flex = 0;
    typeCol.width = 88;
    typeCol.minWidth = 80;

    const endpointCol: any = this.utils.getNonEditableColumnDef('entity.service.endpoint', 'serviceURL', 160);
    endpointCol.flex = 1;
    endpointCol.tooltipField = 'serviceURL';

    const statusCol: any = this.utils.getNonEditableColumnDef('entity.service.accessStatus', 'accessLabel');
    statusCol.flex = 0;
    statusCol.width = 172;
    statusCol.minWidth = 112;
    statusCol.sort = 'desc';
    statusCol.cellClass = 'read-only-cell sitmun-access-status-cell';
    statusCol.valueGetter = (params) => this.statusText(params.data);
    statusCol.comparator = (_left, _right, nodeA, nodeB) =>
      (nodeA?.data?.summary?.statusRank ?? 0) - (nodeB?.data?.summary?.statusRank ?? 0);
    statusCol.cellRenderer = (params) => params.data
      ? renderAccessStatus(params.data.summary?.status, this.statusText(params.data))
      : '';

    const trendCol: any = {
      headerName: this.utils.getTranslate('entity.service.trend'),
      colId: 'trend',
      field: 'trend',
      editable: false,
      sortable: false,
      filter: false,
      flex: 0,
      width: 156,
      minWidth: 120,
      cellClass: 'read-only-cell sitmun-access-trend-cell',
      valueGetter: () => '',
      cellRenderer: (params) => params.data
        ? renderAccessTrend(params.data.summary?.hours, (key) => this.utils.getTranslate(key))
        : '',
    };

    const usageCol: any = this.utils.getNonEditableColumnDef('entity.service.usage30', 'usage30');
    usageCol.flex = 0;
    usageCol.width = 128;
    usageCol.minWidth = 112;
    usageCol.cellClass = 'read-only-cell sitmun-usage-cell';
    usageCol.valueGetter = (params) => this.usageText(params.data);
    usageCol.comparator = (_left, _right, nodeA, nodeB) => this.compareUsage(nodeA?.data, nodeB?.data);
    usageCol.cellRenderer = (params) => params.data
      ? renderServiceUsage(
        params.data.summary?.usage30,
        (key) => this.utils.getTranslate(key),
        this.translateService.currentLang || 'es',
      )
      : '';

    return [
      this.gridHeader(nameCol),
      this.gridHeader(typeCol),
      this.gridHeader(endpointCol),
      this.gridHeader(statusCol),
      trendCol,
      this.gridHeader(usageCol),
    ];
  }

  private buildAffectedColumns(): any[] {
    const nameCol: any = this.utils.getRouterLinkColumnDef(
      'dashboard.affected.application',
      'applicationName',
      'application/:id/applicationForm',
      {id: 'applicationId'},
      160,
    );
    nameCol.flex = 0;
    nameCol.width = 280;

    const servicesCol: any = this.utils.getNonEditableColumnDef('dashboard.affected.services', 'failingServices');
    servicesCol.flex = 1;
    servicesCol.minWidth = 160;
    servicesCol.valueGetter = (params) => this.failingServicesText(params.data);
    servicesCol.tooltipValueGetter = (params) => this.failingServicesText(params.data);
    servicesCol.cellRenderer = (params) => this.renderFailingServices(params.data);

    const requestsCol: any = this.utils.getNonEditableColumnDef('dashboard.affected.requests', 'requests30d');
    requestsCol.flex = 0;
    requestsCol.width = 148;
    requestsCol.minWidth = 120;
    requestsCol.sort = 'desc';
    requestsCol.headerClass = 'ag-right-aligned-header';
    requestsCol.cellClass = 'ag-right-aligned-cell read-only-cell';

    const usageCol: any = this.utils.getNonEditableColumnDef('dashboard.affected.usage', 'usage');
    usageCol.flex = 0;
    usageCol.width = 148;
    usageCol.minWidth = 120;
    usageCol.valueGetter = (params) => this.affectedUsageText(params.data);
    usageCol.cellRenderer = (params) => params.data
      ? this.renderAffectedUsage(params.data)
      : '';

    return [
      this.gridHeader(nameCol),
      this.gridHeader(servicesCol),
      this.gridHeader(requestsCol),
      this.gridHeader(usageCol),
    ];
  }

  private gridHeader(col: any): any {
    const headerClass = [col.headerClass, 'sitmun-dashboard-header'].filter(Boolean).join(' ');
    return {...col, sortable: true, filter: true, icons: FILTER_MENU, headerClass};
  }

  private statusText(row: AttentionRow | undefined): string {
    return accessStatusLabel(row?.summary?.status, (key) => this.utils.getTranslate(key));
  }

  private usageText(row: AttentionRow | undefined): string | number {
    const usage = row?.summary?.usage30;
    if (!usage?.measured) {
      return this.utils.getTranslate('entity.service.usage.notMeasured');
    }
    return usage.total ?? 0;
  }

  private compareUsage(left: AttentionRow | undefined, right: AttentionRow | undefined): number {
    const leftUsage = left?.summary?.usage30;
    const rightUsage = right?.summary?.usage30;
    const leftMissing = !leftUsage?.measured;
    const rightMissing = !rightUsage?.measured;
    if (leftMissing !== rightMissing) {
      return leftMissing ? 1 : -1;
    }
    return (leftUsage?.total ?? 0) - (rightUsage?.total ?? 0);
  }

  private failingServicesText(row: AffectedApplication | undefined): string {
    const services = row?.failingServices ?? [];
    if (!services.length) {
      return '';
    }
    return `${services.length} ${services.map((service) => service.name).join(', ')}`;
  }

  private renderFailingServices(row: AffectedApplication | undefined): HTMLElement | string {
    const services = row?.failingServices ?? [];
    if (!services.length) {
      return '';
    }
    const root = document.createElement('span');
    root.className = 'dashboard-failing-services';
    const count = document.createElement('span');
    count.className = 'dashboard-failing-services-count';
    count.textContent = String(services.length);
    root.appendChild(count);
    root.appendChild(document.createTextNode(services.map((service) => service.name).join(', ')));
    return root;
  }

  private affectedUsageText(row: AffectedApplication | undefined): string {
    if (!row) {
      return '';
    }
    return this.utils.getTranslate(row.usage === 'used' ? 'dashboard.affected.used' : 'dashboard.affected.configured');
  }

  private renderAffectedUsage(row: AffectedApplication): HTMLElement {
    const root = document.createElement('span');
    root.className = row.usage === 'configured' ? 'dashboard-affected-use cfg' : 'dashboard-affected-use';
    const dot = document.createElement('i');
    dot.setAttribute('aria-hidden', 'true');
    root.appendChild(dot);
    root.appendChild(document.createTextNode(this.affectedUsageText(row)));
    return root;
  }

  private minutesSince(summaries: ServiceAccessSummary[]): number | null {
    const times = summaries
      .map((summary) => Date.parse(summary.observedAt))
      .filter((time) => !Number.isNaN(time));
    if (!times.length) {
      return null;
    }
    return Math.max(0, Math.round((Date.now() - Math.max(...times)) / 60000));
  }

  private async serviceIndex(): Promise<Map<number, {name: string; type: string; serviceURL: string}>> {
    try {
      const services = await firstValueFrom(this.serviceService.fetchAllRawItems());
      return new Map(services.map((service) => [service.id, {name: service.name, type: service.type, serviceURL: service.serviceURL}]));
    } catch {
      return new Map();
    }
  }

  saveKPI(result){
    this.KPIsTable.push({
      text: this.utils.getTranslate("dashboard.totalUsers"), 
      number: result.total.users,
      icon: this.kpiIcons.users,
      tooltip: this.utils.getTranslate("dashboard.totalUsers.tooltip"),
      link: '/user',
    });
    this.KPIsTable.push({
      text: this.utils.getTranslate("dashboard.services"), 
      number: result.total.services,
      icon: this.kpiIcons.services,
      tooltip: this.utils.getTranslate("dashboard.services.tooltip"),
      link: '/service',
    });
    this.KPIsTable.push({
      text: this.utils.getTranslate("dashboard.tasks"), 
      number: result.total.tasks,
      icon: this.kpiIcons.tasks,
      tooltip: this.utils.getTranslate("dashboard.tasks.tooltip"),
      link: '/taskGroup',
    });
    this.KPIsTable.push({
      text: this.utils.getTranslate("dashboard.territories"), 
      number: result.total.territories,
      icon: this.kpiIcons.territories,
      tooltip: this.utils.getTranslate("dashboard.territories.tooltip"),
      link: '/territory',
    });
    this.KPIsTable.push({
      text: this.utils.getTranslate("dashboard.cartographies"), 
      number: result.total.cartographies,
      icon: this.kpiIcons.cartographies,
      tooltip: this.utils.getTranslate("dashboard.cartographies.tooltip"),
      link: '/layers',
    });
    this.KPIsTable.push({
      text: this.utils.getTranslate("dashboard.applications"), 
      number: result.total.applications,
      icon: this.kpiIcons.applications,
      tooltip: this.utils.getTranslate("dashboard.applications.tooltip"),
      link: '/application',
    });
    this.KPIsTable.push({
      text: this.utils.getTranslate("dashboard.applicationsTerritories"), 
      number: result.total['applications-territories'],
      icon: this.kpiIcons.applicationsTerritories,
      tooltip: this.utils.getTranslate("dashboard.applicationsTerritories.tooltip"),
      link: '/application',
    });
  }

}
