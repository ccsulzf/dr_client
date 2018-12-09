import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../services';
import { BaseDataService } from '../../../../../core/providers';
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
  public isFundParty = false;
  public isFundWay = false;
  public isFundAccount = false;

  public expenseBook;

  public address;
  public addressItem;

  public expenseCategory;
  public expenseCategoryItem;

  public fundParty;
  public fundPartyItem;

  public fundWay;
  public fundWayItem;

  public fundAccount;
  public fundAccountItem;
  constructor(
    public accountService: AccountService,
    public http: HttpClientService,
    public baseDataService: BaseDataService
  ) {
    this.baseData = BaseData;
    this.expenseBook = this.baseData.expenseBookList[0];
  }

  ngOnInit() {
    this.getExpenseCategoryList();
  }


  selectExpenseBook(item) {
    this.expenseBook = item;
    this.getExpenseCategoryList();
  }

  async getExpenseCategoryList() {
    if (this.expenseBook) {
      this.baseData.expenseCategoryList = await this.http.get('/DR/ExpenseCategory?expenseBookId=' + this.expenseBook.id);
    }
  }

  blur(value) {
    setTimeout(() => {
      this[value] = false;
    }, 100);
  }

  setFundAccount(item) {
    this.fundAccountItem = item;
    this.fundAccount = item.name;
  }

  setFundWay(item) {
    this.fundWayItem = item;
    this.fundWay = item.name;
  }

  setFundParty(item) {
    this.fundPartyItem = item;
    this.fundParty = item.name;
  }

  setAddress(item) {
    this.addressItem = item;
    this.address = item.province + '/' + item.city + '/' + item.area;
  }

  setExpenseCategory(item) {
    this.expenseCategoryItem = item;
    this.expenseCategory = item.name;
  }

  addExpenseBook() {
    this.accountService.changeComponent({ component: 'expenseBook-add-edit' });
  }

  addAddress() {
    this.address = '';
    this.accountService.changeComponent({ component: 'address-add-edit' });
  }

  addExpenseCategory() {
    this.expenseCategory = '';
    this.expenseCategoryItem = null;
    this.accountService.changeComponent({ component: 'expenseCategory-add-edit', data: this.expenseBook });
  }

  addFundParty() {
    this.fundParty = '';
    this.fundPartyItem = null;
    this.accountService.changeComponent({ component: 'fundParty-add-edit', data: 1 });
  }

  addFundWay() {
    this.fundWay = '';
    this.fundWayItem = null;
    this.accountService.changeComponent({ component: 'fundWay-add-edit' });
  }

  addFundAccount() {
    this.fundAccount = '';
    this.fundAccountItem = null;
    if (this.fundWay && this.fundWayItem) {
      this.accountService.changeComponent({ component: 'fundAccount-add-edit', data: this.fundWayItem });
    }
  }
}
