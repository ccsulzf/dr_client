import { Component, OnInit, Input } from '@angular/core';
import { HttpClientService, BaseDataService, BaseData, SystemService } from '../../../../../../core/providers';
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
    public accountService: AccountService,
    public http: HttpClientService,
    public baseDataService: BaseDataService,
    public expenseService: ExpenseService,
    public system: SystemService
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
    this.system.changeComponent({ component: 'expense-list' });
  }

  edit(item) {
    this.expenseService.edit({
      expenseDetail: _.cloneDeep(item),
      expense: this.data
    });
  }
}
