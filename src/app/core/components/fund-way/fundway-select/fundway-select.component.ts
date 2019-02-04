import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { SystemService, BaseData } from '../../../providers';
import * as _ from 'lodash';

@Component({
  selector: 'fundway-select',
  templateUrl: './fundway-select.component.html',
  styleUrls: ['./fundway-select.component.scss']
})
export class FundwaySelectComponent implements OnInit, OnDestroy {

  @Input() title;
  @Output() setFundWay = new EventEmitter<string>();

  fundWayList = [];
  fundWayItem;
  fundWay;

  showListEvent;
  doneEvent;

  isListShow = false;

  clickId = 'fundWay-list';

  constructor(
    private system: SystemService
  ) { }

  ngOnInit() {
    this.fundWayList = BaseData.fundWayList;
    this.select(_.first(this.fundWayList));
    this.showListEvent = this.system.showListEvent.subscribe((data) => {
      if (this.clickId === data.id) {
        this.isListShow = !this.isListShow;
      } else {
        if (data.id) {
          this.isListShow = false;
        }
      }
    });
    this.doneEvent = this.system.doneEvent.subscribe((value) => {
      if (value && value.model === 'fundWay') {
        this.select(value.data);
      } else {
        this.select(_.first(this.fundWayList));
      }
    });
  }

  ngOnDestroy() {
    if (this.showListEvent) {
      this.showListEvent.unsubscribe();
    }
  }

  select(item?) {
    this.isListShow = false;
    if (item) {
      this.fundWayItem = item;
      this.fundWay = item.name;
      this.setFundWay.emit(this.fundWayItem.id);
    } else {
      this.fundWayItem = null;
      this.fundWay = '';
    }
  }


  add() {
    this.select();
    this.system.changeComponent({ component: 'fundWay-add-edit' });
  }

}
