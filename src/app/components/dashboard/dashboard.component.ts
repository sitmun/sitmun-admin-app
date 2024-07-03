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
  KPIsTable = [];
  totalKPIs;
  sumKPIs;
  cartographiesOnDate;
  cartographyChartData = [];
  usersOnDate;
  usersChartData= [];
  usersToShow = [];

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
          console.log(result);
          this.saveKPI(result);
          this.totalKPIs=result.total;
          this.sumKPIs=result.sum;
          this.cartographiesOnDate=result['cartographies-created-on-date']
          this.usersOnDate=result['users-created-on-date']
          let keysCartographyChartData= Object.keys(this.cartographiesOnDate).sort();
          for(let i=0; i<keysCartographyChartData.length; i++){
            this.cartographyChartData.push({index:keysCartographyChartData[i], value:this.cartographiesOnDate[keysCartographyChartData[i]]})
          }
          let keysUsersChartData=Object.keys(this.usersOnDate).sort();
          for(let i=0; i<keysUsersChartData.length; i++){
            this.usersChartData.push({index:keysUsersChartData[i], value:this.usersOnDate[keysUsersChartData[i]]})
          }
          this.usersToShow=this.usersChartData.slice(this.usersChartData.length -30,this.usersChartData.length);
          let keysUsersPerApplication= Object.keys(result[`users-per-application`]);
          for(let i=0; i<keysUsersPerApplication.length; i++){
            this.usersPerApplicationChartData.push({index:keysUsersPerApplication[i], value:result[`users-per-application`][keysUsersPerApplication[i]]})
          }   
          console.log(this.usersToShow);
          console.log(this.usersChartData)

          console.log(this.cartographyChartData)
          resolve(true);
        }
      );
    }));

    Promise.all(promises).then(() => {
      this.dataLoaded=true;
      console.log(this.KPIsTable);
      console.log(this.sumKPIs);
      console.log(this.cartographiesOnDate);


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
