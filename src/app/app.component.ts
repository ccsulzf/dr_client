import { Component, OnInit } from '@angular/core';
import { BaseDataService, SystemService } from './core/providers';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    public baseData: BaseDataService,
    public system: SystemService
  ) { }

  ngOnInit() {

  }
}
