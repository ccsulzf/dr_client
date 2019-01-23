import { Component, OnInit } from '@angular/core';
import { HttpClientService, BaseDataService } from '../../../../../core/providers';
import { AccountService, ExpenseService } from '../../../services';
import * as moment from 'moment';
import * as _ from 'lodash';
@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss']
})
export class ExpenseListComponent implements OnInit {

  constructor(
    private accountService: AccountService,
    private http: HttpClientService,
    private baseDataService: BaseDataService,
    private expenseService: ExpenseService
  ) { }

  ngOnInit() {
    this.http.get('/DR/Expense?expenseDate=' + moment().format('YYYY-MM-DD')).then((data: any) => {
      this.expenseService.expenseList = [];
      if (data && data.length) {
        for (const item of data) {
          const expenseBook = this.baseDataService.getExpenseBook(item.expenseBookId);
          item.expenseBookName = expenseBook.name;
          this.expenseService.expenseList.push(item);
        }
        this.expenseService.totalDayAmount = _.map(data, 'totalAmount').reduce(
          (acc, cur) => acc + cur,
          0
        );
      }
    });
  }

  toDetailList() {
    this.accountService.changeComponent({ component: 'expense-detail' });
  }

  goDetail(item) {
    this.accountService.changeComponent({ component: 'expense-detail', data: item });
  }

}
