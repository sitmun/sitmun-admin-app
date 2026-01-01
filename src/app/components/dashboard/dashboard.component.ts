import {Component, OnInit} from '@angular/core';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger
} from '@angular/animations';
import {DashboardService} from '@app/domain';
import {UtilsService} from '@app/services/utils.service';
import {Configuration} from '@app/core/config/configuration';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-out', 
          style({ opacity: 1, transform: 'translateY(0)' })
        )
      ])
    ]),
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(50, [
            animate('400ms ease-out', 
              style({ opacity: 1, transform: 'translateY(0)' })
            )
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit {

  readonly config = Configuration.DASHBOARD;

  dataLoaded: boolean;

  cartographyDataAvailable = false;
  usersDataAvailable = false;
  usersPerApplicationDataAvailable = false;

  KPIsTable: Array<{
    text: string; 
    number: number; 
    icon: string; 
    color: string;
    tooltip: string;
  }> = [];
  totalKPIs;
  sumKPIs;
  cartographiesOnDate;
  cartographyChartData = [];
  usersOnDate;
  usersChartData= [];
  usersToShow = [];
  usersPerApplication;
  usersPerApplicationChartData=[];

  /**
   * Icon mapping for different KPI types
   */
  private readonly kpiIcons = {
    users: 'group',
    services: 'cloud_queue',
    tasks: 'assignment',
    territories: 'place',
    cartographies: 'layers',
    applications: 'apps',
    applicationsTerritories: 'account_tree'
  };

  /**
   * Color accent mapping for different KPI types
   */
  private readonly kpiColors = {
    users: 'primary',
    services: 'accent',
    tasks: 'primary',
    territories: 'accent',
    cartographies: 'primary',
    applications: 'accent',
    applicationsTerritories: 'primary'
  };

  constructor(
    public utils: UtilsService,
    public dashboardService: DashboardService,
    ) { }

  ngOnInit(): void {

    const promises: Promise<any>[] = [];

    promises.push(new Promise((resolve, reject) => {
      this.dashboardService.getAll().subscribe({
        next: (result) => {
          try {
            this.saveKPI(result);
            this.totalKPIs=result.total;
            this.sumKPIs=result.sum;
            this.cartographiesOnDate=result['cartographies-created-on-date']
            this.usersOnDate=result['users-created-on-date']
            this.usersPerApplication=result['users-per-application']
            if(this.cartographiesOnDate){
              this.cartographyDataAvailable = true;
              const keysCartographyChartData= Object.keys(this.cartographiesOnDate).sort();
              for (const item of keysCartographyChartData) {
                this.cartographyChartData.push({index:item, value:this.cartographiesOnDate[item]})
              }
            }
            if(this.usersOnDate){
              this.usersDataAvailable = true;
              const keysUsersChartData=Object.keys(this.usersOnDate).sort();
              for (const item of keysUsersChartData) {
                this.usersChartData.push({index:item, value:this.usersOnDate[item]})
              }
              this.usersToShow=this.usersChartData.slice(this.usersChartData.length -30,this.usersChartData.length);
            }
            if(this.usersPerApplication){
              this.usersPerApplicationDataAvailable = true;
              const keysUsersPerApplication= Object.keys(this.usersPerApplication);
              for (const item of keysUsersPerApplication) {
                this.usersPerApplicationChartData.push({index:item, value:this.usersPerApplication[item]})
              }
            }

            resolve(true);
          } catch (error) {
            console.error('Error processing dashboard data:', error);
            reject(error);
          }
        },
        error: (error) => {
          console.error('Error fetching dashboard data:', error);
          reject(error);
        }
      });
    }));

    Promise.all(promises).then(() => {
      this.dataLoaded=true;
    }).catch((error) => {
      console.error('Dashboard initialization failed:', error);
      this.dataLoaded=true; // Still set to true to show the UI even with partial data
    });
  }

  saveKPI(result){
    this.KPIsTable.push({
      text: this.utils.getTranslate("dashboard.totalUsers"), 
      number: result.total.users,
      icon: this.kpiIcons.users,
      color: this.kpiColors.users,
      tooltip: this.utils.getTranslate("dashboard.totalUsers.tooltip")
    });
    this.KPIsTable.push({
      text: this.utils.getTranslate("dashboard.services"), 
      number: result.total.services,
      icon: this.kpiIcons.services,
      color: this.kpiColors.services,
      tooltip: this.utils.getTranslate("dashboard.services.tooltip")
    });
    this.KPIsTable.push({
      text: this.utils.getTranslate("dashboard.tasks"), 
      number: result.total.tasks,
      icon: this.kpiIcons.tasks,
      color: this.kpiColors.tasks,
      tooltip: this.utils.getTranslate("dashboard.tasks.tooltip")
    });
    this.KPIsTable.push({
      text: this.utils.getTranslate("dashboard.territories"), 
      number: result.total.territories,
      icon: this.kpiIcons.territories,
      color: this.kpiColors.territories,
      tooltip: this.utils.getTranslate("dashboard.territories.tooltip")
    });
    this.KPIsTable.push({
      text: this.utils.getTranslate("dashboard.cartographies"), 
      number: result.total.cartographies,
      icon: this.kpiIcons.cartographies,
      color: this.kpiColors.cartographies,
      tooltip: this.utils.getTranslate("dashboard.cartographies.tooltip")
    });
    this.KPIsTable.push({
      text: this.utils.getTranslate("dashboard.applications"), 
      number: result.total.applications,
      icon: this.kpiIcons.applications,
      color: this.kpiColors.applications,
      tooltip: this.utils.getTranslate("dashboard.applications.tooltip")
    });
    this.KPIsTable.push({
      text: this.utils.getTranslate("dashboard.applicationsTerritories"), 
      number: result.total['applications-territories'],
      icon: this.kpiIcons.applicationsTerritories,
      color: this.kpiColors.applicationsTerritories,
      tooltip: this.utils.getTranslate("dashboard.applicationsTerritories.tooltip")
    });
  }

}
