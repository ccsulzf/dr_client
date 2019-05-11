import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { SystemService } from '../../../../../core/providers';
import { ReportService } from '../../../services';

import { FILTER_CONFIG } from './report-filter.config';
import * as _ from 'lodash';
import * as moment from 'moment';
@Component({
  selector: 'report-filter',
  templateUrl: './report-filter.component.html',
  styleUrls: ['./report-filter.component.scss']
})
export class ReportFilterComponent implements OnInit, OnDestroy {
  isListShow = false;
  modalShow = false;
  removeSelectEvent;

  @ViewChild('filterClick') filterClick: ElementRef;

  @ViewChild('ulClick') ulClick: ElementRef;

  public reportConfig;

  public selectedConfigList = [];

  public startDate;
  public endDate;

  public dateTypeList = [
    { name: '日度', viewType: 'day' },
    { name: '月度', viewType: 'month' },
    { name: '年度', viewType: 'year' }
  ];

  public selectedDateType;
  constructor(
    public reportService: ReportService,
    public system: SystemService,
  ) { }

  ngOnInit() {
    this.selectDateType(this.dateTypeList[0].viewType);
    this.reportConfig = FILTER_CONFIG;
  }

  selectDateType(viewType) {
    this.selectedDateType = viewType;
    switch (this.selectedDateType) {
      case 'day':
        this.startDate = moment().format('YYYY-MM-DD');
        this.endDate = moment().format('YYYY-MM-DD');
        break;
      case 'month':
        this.startDate = moment().format('YYYY-MM');
        this.endDate = moment().format('YYYY-MM');
        break;
      case 'year':
        this.startDate = moment().format('YYYY');
        this.endDate = moment().format('YYYY');
        break;
      default:
        break;
    }
  }


  reset() {
    this.system.reset();
    this.reportService.conditions = [];
  }

  confirm() {
    this.reportService.getFilter();
  }

  query() {
    this.getDate();
    this.reportService.getData();
    // console.info(this.reportService.conditions);
    // console.info(this.reportService.dateTime);
  }

  ngOnDestroy() {
  }

  onSetDate(data) {
    if (data.name === 'startDate') {
      this.startDate = data.date;
    }
    if (data.name === 'endDate') {
      this.endDate = data.date;
    }
  }

  getDate() {
    this.reportService.dateTime.type = this.selectedDateType;
    this.reportService.dateTime.startDate = this.startDate;
    this.reportService.dateTime.endDate = this.endDate;
  }
}
