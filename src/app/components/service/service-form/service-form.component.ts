import { Component, OnInit } from '@angular/core';
import {  ActivatedRoute,  Router} from '@angular/router';


@Component({
  selector: 'app-service-form',
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.scss']
})
export class ServiceFormComponent implements OnInit {

  serviceID: number = -1;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    ) {
      this.activatedRoute.params.subscribe(params => {
        this.serviceID = +params.id;
        console.log(this.serviceID);
      });
    }

  ngOnInit(): void {
  }

}