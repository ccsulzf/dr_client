import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../services';
import { BaseData } from '../../../../../core/providers/base-data';
import { HttpClientService } from '../../../../../core/providers';
@Component({
  selector: 'expense-add-edit',
  templateUrl: './expense-add-edit.component.html',
  styleUrls: ['./expense-add-edit.component.scss']
})
export class ExpenseAddEditComponent implements OnInit {
  public baseData;
  public isAddressShow = false;
  public isExpenseCategory = false;
  public selectExpenseBook;

  public address;
  public addressItem;

  public expenseCategory;
  public expenseCategoryItem;

  public expenseCategoryList: any = [];
  constructor(
    public accountService: AccountService,
    public http: HttpClientService
  ) {
    this.baseData = BaseData;
    this.selectExpenseBook = this.baseData.expenseBookList[0];
  }

  async ngOnInit() {
    if (this.selectExpenseBook) {
      this.expenseCategoryList = await this.http.get('/DR/ExpenseCategory?expenseBookId=' + this.selectExpenseBook.id);
    }
  }

  blur(value) {
    setTimeout(() => {
      this[value] = false;
    }, 300);
  }

  setAddress(item) {
    this.addressItem = item;
    this.address = item.province + '/' + item.city + '/' + item.district;
  }

  setExpenseCategory(item) {
    this.expenseCategoryItem = item;
    this.expenseCategory = item.name;
  }

  addExpenseBook() {
    this.accountService.changeComponent('expenseBook-add-edit');
  }

  addAddress() {
    this.address = '';
    this.accountService.changeComponent('address-add-edit');
  }

  addExpenseCategory(){
    this.expenseCategory = '';
    this.accountService.changeComponent('expenseCategory-add-edit');
  }
}
