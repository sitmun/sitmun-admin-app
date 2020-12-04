import { Component, OnInit } from '@angular/core';
import {  ActivatedRoute,  Router} from '@angular/router';


@Component({
  selector: 'app-background-layers-form',
  templateUrl: './background-layers-form.component.html',
  styleUrls: ['./background-layers-form.component.scss']
})
export class BackgroundLayersFormComponent implements OnInit {


  backgroundID: number = -1;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    ) {
      this.activatedRoute.params.subscribe(params => {
        this.backgroundID = +params.id;
        console.log(this.backgroundID);
      });
    }

  ngOnInit(): void {
  }

}