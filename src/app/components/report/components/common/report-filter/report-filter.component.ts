import { Component, OnInit, OnDestroy, ElementRef, ViewChild, HostListener } from '@angular/core';
import { ReportService } from '../../../services';
import * as _ from 'lodash';
@Component({
  selector: 'report-filter',
  templateUrl: './report-filter.component.html',
  styleUrls: ['./report-filter.component.scss']
})
export class ReportFilterComponent implements OnInit, OnDestroy {
  isListShow = false;

  removeSelectEvent;

  @ViewChild('filterClick') filterClick: ElementRef;

  @ViewChild('ulClick') ulClick: ElementRef;

  public reportConfig = [{
    code: 'expenseBook',
    name: '账本',
    type: 'equal',
    limit: null,
    selected: false
  }, {
    code: 'expenseCategory',
    name: '类别',
    type: 'equal',
    limit: 'expenseBook',
    selected: false
  }, {
    code: 'address',
    name: '地点',
    type: 'equal',
    limit: null,
    selected: false
  }, {
    code: 'fundAccount',
    name: '支付账户',
    type: 'equal',
    limit: null,
    selected: false
  }, {
    code: 'fundChannel',
    name: '支付渠道',
    type: 'equal',
    limit: null,
    selected: false
  }, {
    code: 'participant',
    name: '参与人',
    type: 'equal',
    limit: null,
    selected: false
  }, {
    code: 'amout',
    name: '金额',
    type: 'equal',
    limit: null,
    selected: false
  }, {
    code: 'content',
    name: '支出内容',
    type: 'equal',
    limit: null,
    selected: false
  }];

  public selectedConfigList = [];
  constructor(
    public reportService: ReportService
  ) { }

  ngOnInit() {
    this.removeSelectEvent = this.reportService.removeSelectEvent.subscribe((data) => {
      let item = _.find(this.reportConfig, { code: data });
      item.selected = false;
      _.remove(this.selectedConfigList, { code: data });
    });
  }

  ngOnDestroy() {
    this.removeSelectEvent.unsubscribe();
  }


  onSelect(item, value) {
    item.selected = value;
    if (value) {
      this.selectedConfigList.push(item);
    } else {
      _.remove(this.selectedConfigList, { code: item.code });
    }
  }

  @HostListener('document:click', ['$event'])
  onClick() {
    if (this.filterClick.nativeElement.contains(event.target)) {
      this.isListShow = !this.isListShow;
    } else {
      if (this.ulClick.nativeElement.contains(event.target)) {
        this.isListShow = true;
      } else {
        this.isListShow = false;
      }
    }
  }

  onTest(value) {
    console.info('收到！！！');
    console.info(value);
  }

}
