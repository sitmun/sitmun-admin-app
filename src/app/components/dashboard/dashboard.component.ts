import { Component, OnInit } from '@angular/core';
import { DashboardService } from '@app/domain';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '@app/services/utils.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  dataLoaded: boolean;

  cartographyDataAvailable = false;
  usersDataAvailable = false;
  usersPerApplicationDataAvailable = false;

  KPIsTable = [];
  totalKPIs;
  sumKPIs;
  cartographiesOnDate;
  cartographyChartData = [];
  usersOnDate;
  usersChartData= [];
  usersToShow = [];
  usersPerApplication;
  usersPerApplicationChartData=[];
  usersPerApplicationToShow = [];

  constructor(
    private http: HttpClient,
    public utils: UtilsService,
    public dashboardService: DashboardService,
    ) { }

  ngOnInit(): void {

    const promises: Promise<any>[] = [];

    promises.push(new Promise((resolve, ) => {
      this.dashboardService.getAll().subscribe(
        result => {
          this.saveKPI(result);
          this.totalKPIs=result.total;
          this.sumKPIs=result.sum;
          this.cartographiesOnDate=result['cartographies-created-on-date']
          //this.usersOnDate=result['users-created-on-date']
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
        }
      );
    }));

    Promise.all(promises).then(() => {
      this.dataLoaded=true;
    });
  }

  saveKPI(result){
    this.KPIsTable.push({text: this.utils.getTranslate("dashboard.newUsers"), number: result.total.users})
    this.KPIsTable.push({text: this.utils.getTranslate("dashboard.services"), number: result.total.services})
    this.KPIsTable.push({text: this.utils.getTranslate("dashboard.tasks"), number: result.total.tasks})
    this.KPIsTable.push({text: this.utils.getTranslate("dashboard.territories"), number: result.total.territories})
    this.KPIsTable.push({text: this.utils.getTranslate("dashboard.cartographies"), number: result.total.cartographies})
    this.KPIsTable.push({text: this.utils.getTranslate("dashboard.applications"), number: result.total.applications})
    this.KPIsTable.push({text: this.utils.getTranslate("dashboard.applicationsTerritories"), number: result.total['applications-territories']})
  }

}
