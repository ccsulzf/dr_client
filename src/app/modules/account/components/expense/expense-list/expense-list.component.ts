import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { HttpClientService, BaseDataService, SystemService } from '../../../../../core/providers';
import { AccountService, ExpenseService } from '../../../services';
import * as moment from 'moment';
import * as _ from 'lodash';
@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss']
})
export class ExpenseListComponent implements AfterViewInit, OnInit, OnDestroy, AfterViewChecked {
  public date;
  constructor(
    public accountService: AccountService,
    public http: HttpClientService,
    public baseDataService: BaseDataService,
    public expenseService: ExpenseService,
    public cd: ChangeDetectorRef,
    public system: SystemService
  ) {
  }

  ngAfterViewChecked() {
    // this.cd.detectChanges();
  }

  ngOnInit() {
    this.date = this.expenseService.expneseListDate;
  }

  ngAfterViewInit() {
    this.getListByDate(this.expenseService.expneseListDate);
  }

  ngOnDestroy() {

  }

  changeDate(data) {
    this.date = data.date;
    this.getListByDate(data.date);
  }


  getListByDate(expenseDate) {
    this.http.get('/DR/Expense?expenseDate=' + moment(expenseDate).format('YYYY-MM-DD')).then((data: any) => {
      this.expenseService.totalDayAmount = 0;
      this.expenseService.expneseListDate = expenseDate;
      this.expenseService.expenseList = [];
      if (data && data.length) {
        for (const item of data) {
          const expenseBook = this.baseDataService.getExpenseBook(item.expenseBookId);
          item.expenseBookName = expenseBook.name;
          this.expenseService.expenseList.push(item);
          this.expenseService.totalDayAmount = (this.expenseService.totalDayAmount * 100 + item.totalAmount * 100) / 100;
        }
      }
    });
  }

  goDetail(item) {
    this.system.changeComponent({ component: 'expense-detail', data: item });
  }

}
