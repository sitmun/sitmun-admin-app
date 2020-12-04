import { Component, OnInit } from '@angular/core';
import {  ActivatedRoute,  Router} from '@angular/router';
@Component({
  selector: 'app-trees-form',
  templateUrl: './trees-form.component.html',
  styleUrls: ['./trees-form.component.scss']
})
export class TreesFormComponent implements OnInit {

  treesID: number = -1;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    ) {
      this.activatedRoute.params.subscribe(params => {
        this.treesID = +params.id;
        console.log(this.treesID);
      });
    }

  ngOnInit(): void {
  }
}