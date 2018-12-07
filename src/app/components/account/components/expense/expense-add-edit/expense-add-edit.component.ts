import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../services';
import { BaseDataService } from '../../../../../core/providers';
@Component({
  selector: 'expense-add-edit',
  templateUrl: './expense-add-edit.component.html',
  styleUrls: ['./expense-add-edit.component.scss']
})
export class ExpenseAddEditComponent implements OnInit {

  constructor(
    public accountService: AccountService,
    public baseData: BaseDataService
  ) { }

  ngOnInit() {
    console.info(this.baseData.getExpenseBookList());
  }

  addExpenseBook() {
    this.accountService.changeComponent('expenseBook-add-edit');
  }
}
