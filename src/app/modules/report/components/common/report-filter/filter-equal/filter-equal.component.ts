import { Component, OnInit, Input, Output, EventEmitter, HostListener, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ReportService } from '../../../../services';
import { BaseDataService, BaseData, SystemService } from '../../../../../../core/providers';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';

@Component({
  selector: 'filter-equal',
  templateUrl: './filter-equal.component.html',
  styleUrls: ['./filter-equal.component.scss']
})
export class FilterEqualComponent implements OnInit, OnDestroy {
  @Input() data;

  baseData;
  name;
  list = [];
  resetEvent: Subscription;

  getFilterEvent: Subscription;
  constructor(
    public system: SystemService,
    public reportService: ReportService
  ) {
    this.baseData = BaseData;
  }

  ngOnInit() {
    this.name = this.data.name;
    this.list = _.cloneDeep(this.baseData[`${this.data.code}List`]);
    this.init();
    this.resetEvent = this.system.resetEvent.subscribe(() => {
      this.init();
    });

    this.getFilterEvent = this.reportService.getFilterEvent.subscribe(() => {
      const selectedList = _.filter(this.list, { selected: true });
      if (selectedList && selectedList.length) {
        this.reportService.conditions.push({
          field: this.data.code + 'Id',
          type: this.data.type,
          value: _.map(selectedList, 'id')
        });
      }
    });
  }

  init() {
    for (const item of this.list) {
      item.selected = false;
    }
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
