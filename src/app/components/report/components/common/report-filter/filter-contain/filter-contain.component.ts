import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ReportService } from '../../../../services';
import { SystemService } from '../../../../../../core/providers';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
@Component({
  selector: 'filter-contain',
  templateUrl: './filter-contain.component.html',
  styleUrls: ['./filter-contain.component.scss']
})
export class FilterContainComponent implements OnInit, OnDestroy {
  @Input() data;
  name;
  resetEvent: Subscription;

  getFilterEvent: Subscription;

  content;
  constructor(
    public reportService: ReportService,
    public system: SystemService
  ) { }

  ngOnInit() {
    this.name = this.data.name;
    this.resetEvent = this.system.resetEvent.subscribe(() => {
      this.init();
    });
    this.getFilterEvent = this.reportService.getFilterEvent.subscribe(() => {
      if (this.content) {
        this.reportService.conditions.push({
          field: this.data.code,
          type: this.data.type,
          value: this.content
        });
      }
    });
  }

  init() {
    this.content = '';
  }

  ngOnDestroy() {
    if (this.resetEvent) {
      this.resetEvent.unsubscribe();
    }
    if (this.getFilterEvent) {
      this.getFilterEvent.unsubscribe();
    }
  }
}
