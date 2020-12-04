import { Component, OnInit } from '@angular/core';
import {  ActivatedRoute,  Router} from '@angular/router';

@Component({
  selector: 'app-territory-form',
  templateUrl: './territory-form.component.html',
  styleUrls: ['./territory-form.component.scss']
})
export class TerritoryFormComponent implements OnInit {

  stopID: number = -1;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    ) {
      this.activatedRoute.params.subscribe(params => {
        this.stopID = +params.id;
        console.log(this.stopID);
      });
    }

  ngOnInit(): void {
  }

}
