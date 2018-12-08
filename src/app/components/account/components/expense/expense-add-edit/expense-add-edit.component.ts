import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../services';
import { BaseData } from '../../../../../core/providers/base-data';
@Component({
  selector: 'expense-add-edit',
  templateUrl: './expense-add-edit.component.html',
  styleUrls: ['./expense-add-edit.component.scss']
})
export class ExpenseAddEditComponent implements OnInit {
  public baseData;
  public isAddressShow = false;

  public address;
  constructor(
    public accountService: AccountService,
  ) {
    this.baseData = BaseData;
  }

  ngOnInit() {
  }

  blur(value) {
    setTimeout(() => {
      this[value] = false;
    }, 300);
  }

  setAddress(item) {
    this.address = item.province + '/' + item.city + '/' + item.district;
  }

  addExpenseBook() {
    this.accountService.changeComponent('expenseBook-add-edit');
  }

  addAddress() {
    this.address = '';
    this.accountService.changeComponent('address-add-edit');
  }
}
