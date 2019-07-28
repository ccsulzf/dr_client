import { Component, OnInit, Input, HostListener, OnDestroy, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { BaseData, SystemService } from '../../../providers';
import * as _ from 'lodash';

export const EXPENSEBOOK_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ExpenseBookListComponent),
  multi: true
};
@Component({
  selector: 'expense-book-list',
  templateUrl: './expense-book-list.component.html',
  styleUrls: ['./expense-book-list.component.scss'],
  providers: [EXPENSEBOOK_ACCESSOR]
})
export class ExpenseBookListComponent implements OnInit, OnDestroy, ControlValueAccessor {
  public baseData;
  public expenseBookList;
  public selectedExpenseBook;

  doneEvent;

  constructor(
    public system: SystemService
  ) { }

  propagateChange = (temp: any) => { };

  writeValue(value: any) {
    if (value) {
      this.select(_.find(BaseData.expenseBookList, { id: value }));
    } else {
      this.select(BaseData.expenseBookList[0]);
    }
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any) { }

  ngOnInit() {
    this.baseData = BaseData;
    this.expenseBookList = [];
    for (const item of this.baseData.expenseBookList) {
      const temp = {
        name: item.name,
        id: item.id,
        backgroundColor: '#5755d9',
        border: '1px solid #4b48d6',
      };
      this.expenseBookList.push(temp);
    }
    this.select(this.expenseBookList[0]);
    this.doneEvent = this.system.doneEvent.subscribe((value) => {
      if (value && value.model === 'expenseBook') {
        const item = {
          name: value.data.name,
          id: value.data.id,
          backgroundColor: '#5755d9',
          border: '1px solid #4b48d6',
        };
        this.expenseBookList.push(item);
        this.select(item);
      }
    });
  }

  @HostListener('keydown', ['$event'])
  hotKeyEvent(e) {
    let index = -1;
    let nextIndex = 0;
    let prevIndex = 0;
    if (this.selectedExpenseBook) {
      index = _.findIndex(this.baseData.expenseBookList, { id: this.selectedExpenseBook.id });
      nextIndex = (index === this.baseData.expenseBookList.length - 1) ? 0 : index + 1;
      prevIndex = (index === 0) ? this.baseData.expenseBookList.length - 1 : index - 1;
    } else {
      nextIndex = (index === this.baseData.expenseBookList.length - 1) ? 0 : index + 1;
      prevIndex = this.baseData.expenseBookList.length - 1;
    }
    switch (e.keyCode) {
      case 38: // 上
        this.propagateChange(this.baseData.expenseBookList[prevIndex]);
        break;
      case 40: // 下
        this.propagateChange(this.baseData.expenseBookList[nextIndex]);
        break;
      // case 13:
      //   e.stopPropagation();
      //   this.select(this.selectedExpenseBook);
      //   break;
      default:
        break;
    }
  }

  select(data) {
    this.selectedExpenseBook = data;
    this.propagateChange(data);
  }

  addExpenseBook() {
    this.system.changeComponent({ component: 'expenseBook-add-edit', data: null });
  }

  ngOnDestroy() {
    if (this.doneEvent) {
      this.doneEvent.unsubscribe();
    }
  }

}
