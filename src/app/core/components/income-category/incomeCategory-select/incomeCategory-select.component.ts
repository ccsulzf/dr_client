import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { SystemService, BaseData } from '../../../providers';
import * as _ from 'lodash';
@Component({
  selector: 'incomeCategory-select',
  templateUrl: './incomeCategory-select.component.html',
  styleUrls: ['./incomeCategory-select.component.scss']
})
export class IncomeCategorySelectComponent implements OnInit, OnDestroy {
  @Input() title;
  @Output() setCategory = new EventEmitter<string>();

  incomeCategoryList = [];
  incomeCategoryItem;
  incomeCategory;

  showListEvent;
  doneEvent;

  isListShow = false;

  clickId = 'incomeCategory-list';

  constructor(
    private system: SystemService
  ) { }

  ngOnInit() {
    this.incomeCategoryList = BaseData.incomeCategoryList;
    this.select(_.first(this.incomeCategoryList));
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
      if (value && value.model === 'incomeCategory') {
        this.select(value.data);
      } else {
        this.select(_.first(this.incomeCategoryList));
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
      this.incomeCategoryItem = item;
      this.incomeCategory = item.name;
      this.setCategory.emit(this.incomeCategoryItem.id);
    } else {
      this.incomeCategoryItem = null;
      this.incomeCategory = '';
    }
  }


  add() {
    this.select();
    this.system.changeComponent({ component: 'incomeCategory-add-edit' });
  }
}
