import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { SystemService } from '../../../../../core/providers';
import { ReportService } from '../../../services';
import * as _ from 'lodash';
import { FILTER_CONFIG } from './report-filter.config';
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

  constructor(
    public reportService: ReportService,
    public system: SystemService,
  ) { }

  ngOnInit() {
    this.reportConfig = FILTER_CONFIG;
  }

  reset() {
    this.system.reset();
    this.reportService.conditions = [];
  }

  confirm() {
    this.reportService.getFilter();
    // console.info(this.reportService.conditions);
  }

  ngOnDestroy() {
  }
}
