import { Component, OnInit } from '@angular/core';
import {  ActivatedRoute,  Router} from '@angular/router';

@Component({
  selector: 'app-application-form',
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.scss']
})
export class ApplicationFormComponent implements OnInit {

  applicationID: number = -1;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    ) {
      this.activatedRoute.params.subscribe(params => {
        this.applicationID = +params.id;
        console.log(this.applicationID);
      });
    }

  ngOnInit(): void {
  }

}