import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../frontend-core/src/lib/public_api';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  dataLoaded: boolean;

  cartographyDataAvailable: boolean = false;
  usersDataAvailable: boolean = false;
  usersPerApplicationDataAvailable: boolean = false;

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

    promises.push(new Promise((resolve, reject) => {
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
            let keysCartographyChartData= Object.keys(this.cartographiesOnDate).sort();
            for(let i=0; i<keysCartographyChartData.length; i++){
              this.cartographyChartData.push({index:keysCartographyChartData[i], value:this.cartographiesOnDate[keysCartographyChartData[i]]})
            }
          }
          if(this.usersOnDate){
            this.usersDataAvailable = true;
            let keysUsersChartData=Object.keys(this.usersOnDate).sort();
            for(let i=0; i<keysUsersChartData.length; i++){
              this.usersChartData.push({index:keysUsersChartData[i], value:this.usersOnDate[keysUsersChartData[i]]})
            }
            this.usersToShow=this.usersChartData.slice(this.usersChartData.length -30,this.usersChartData.length);
          }
          if(this.usersPerApplication){
            this.usersPerApplicationDataAvailable = true;
            let keysUsersPerApplication= Object.keys(this.usersPerApplication);
            for(let i=0; i<keysUsersPerApplication.length; i++){
              this.usersPerApplicationChartData.push({index:keysUsersPerApplication[i], value:this.usersPerApplication[keysUsersPerApplication[i]]})
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
