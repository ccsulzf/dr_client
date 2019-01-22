import { Component, OnInit, Input } from '@angular/core';
import { HttpClientService, BaseDataService } from '../../../../../../core/providers';
import { AccountService, ExpenseService } from '../../../../services';

import * as _ from 'lodash';
@Component({
  selector: 'app-expense-detail',
  templateUrl: './expense-detail.component.html',
  styleUrls: ['./expense-detail.component.scss']
})
export class ExpenseDetailComponent implements OnInit {
  @Input() data;

  groupList = [];
  constructor(
    private accountService: AccountService,
    private http: HttpClientService,
    private baseDataService: BaseDataService,
    private expenseService: ExpenseService
  ) { }

  ngOnInit() {
    this.http.get('/DR/ExpenseDetail?expenseId=' + this.data.id).then((list: any) => {
      this.groupList = [];
      if (list && list.length) {
        for (const item of list) {
          const expenseCategory = this.baseDataService.getExpenseCategory(item.expenseCategoryId);

          item.expenseCategoryName = expenseCategory.name;

          const fundParty = this.baseDataService.getFundParty(item.fundPartyId);
          item.fundPartyName = fundParty.name;

          const fundWay = this.baseDataService.getFundWay(item.fundWayId);
          item.fundWayName = fundWay.name;
        }
        this.expenseService.expenseDetailList = list;
        const group = _.groupBy(list, 'expenseCategoryName');

        for (const item in group) {
          this.groupList.push({
            name: item,
            list: group[item]
          });
        }
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
