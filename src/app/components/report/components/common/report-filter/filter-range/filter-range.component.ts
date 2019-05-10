import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ReportService } from '../../../../services';
import { SystemService } from '../../../../../../core/providers';

import { Subscription } from 'rxjs';
import * as _ from 'lodash';
@Component({
  selector: 'filter-range',
  templateUrl: './filter-range.component.html',
  styleUrls: ['./filter-range.component.scss']
})
export class FilterRangeComponent implements OnInit, OnDestroy {
  @Input() data;
  numberRangeStart;
  numberRangeEnd;
  name;

  resetEvent: Subscription;
  getFilterEvent: Subscription;
  constructor(
    public system: SystemService,
    public reportService: ReportService
  ) { }

  ngOnInit() {
    this.name = this.data.name;
    this.resetEvent = this.system.resetEvent.subscribe(() => {
      this.init();

    });
    this.getFilterEvent = this.reportService.getFilterEvent.subscribe(() => {
      if (this.numberRangeStart || this.numberRangeStart) {
        this.reportService.conditions.push({
          field: this.data.code,
          type: this.data.type,
          value: {
            numberRangeStart: this.numberRangeStart,
            numberRangeEnd: this.numberRangeEnd
          }
        });
      }
    });
  }

  init() {
    this.numberRangeEnd = '';
    this.numberRangeStart = '';
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
