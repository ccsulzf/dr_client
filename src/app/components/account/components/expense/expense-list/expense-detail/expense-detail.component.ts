import { Component, OnInit, Input } from '@angular/core';
import { HttpClientService, BaseDataService, BaseData } from '../../../../../../core/providers';
import { AccountService, ExpenseService } from '../../../../services';

import * as _ from 'lodash';
@Component({
  selector: 'app-expense-detail',
  templateUrl: './expense-detail.component.html',
  styleUrls: ['./expense-detail.component.scss']
})
export class ExpenseDetailComponent implements OnInit {
  @Input() data;
  constructor(
    private accountService: AccountService,
    private http: HttpClientService,
    private baseDataService: BaseDataService,
    private expenseService: ExpenseService
  ) { }

  ngOnInit() {
    this.http.get('/DR/ExpenseDetail?expenseId=' + this.data.id).then((list: any) => {
      this.expenseService.expenseDetailList = [];
      if (list && list.length) {
        for (const item of list) {
          this.expenseService.changeExpenseDetail(item);
        }
        this.expenseService.groupDetailList();
      }
    });
  }

  return() {
    this.accountService.changeComponent({ component: 'expense-list' });
  }

  edit(item) {
    this.expenseService.edit({
      expenseDetail: item,
      expense: this.data
    });
  }
}
