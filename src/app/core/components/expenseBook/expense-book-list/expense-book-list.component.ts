import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { BaseData, SystemService } from '../../../providers';
@Component({
  selector: 'expense-book-list',
  templateUrl: './expense-book-list.component.html',
  styleUrls: ['./expense-book-list.component.scss']
})
export class ExpenseBookListComponent implements OnInit, OnDestroy {
  public baseData;
  @Output() setExpenseBook = new EventEmitter<any>();

  public expenseBookList;
  doneEvent;
  resetEvent;
  constructor(
    public system: SystemService
  ) { }

  ngOnInit() {
    this.baseData = BaseData;
    this.expenseBookList = [];
    for (let item of this.baseData.expenseBookList) {

      let temp = {
        name: item.name,
        id: item.id,
        backgroundColor: '#5755d9',
        border: '1px solid #4b48d6',
        selected: false
      }
      this.expenseBookList.push(temp)
    }
    this.select(this.expenseBookList[0]);
    this.doneEvent = this.system.doneEvent.subscribe((value) => {
      if (value && value.model === 'expenseBook') {
        const item = {
          name: value.data.name,
          id: value.data.id,
          backgroundColor: '#5755d9',
          border: '1px solid #4b48d6',
          selected: false
        }
        this.expenseBookList.push(item);
        this.select(item);
      }
    });
  }

  select(data) {
    for (const item of this.expenseBookList) {
      if (item.name === data.name) {
        item.selected = true;
        this.setExpenseBook.emit(item);
      } else {
        item.selected = false;
      }
    }
  }

  addExpenseBook() {
    this.system.changeComponent({ component: 'expenseBook-add-edit' });
  }

  ngOnDestroy() {
    if (this.resetEvent) {
      this.resetEvent.unsubscribe();
    }
    if (this.doneEvent) {
      this.doneEvent.unsubscribe();
    }
  }

}
