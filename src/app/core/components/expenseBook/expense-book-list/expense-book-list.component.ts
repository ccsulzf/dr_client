import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ValidatorFn, AbstractControl, ValidationErrors, NG_VALIDATORS } from '@angular/forms';

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
  // @Input() expenseBookId;
  // @Output() setExpenseBook = new EventEmitter<any>();

  // @Input()
  // set expenseBookId(expenseBookId) {
  //   if (expenseBookId) {
  //     this.select(_.find(BaseData.expenseBookList, { id: expenseBookId }));
  //   } else {
  //     this.select(BaseData.expenseBookList[0]);
  //   }

  // }

  // get expenseBookId() { return this.selectedExpenseBook.id; }

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
