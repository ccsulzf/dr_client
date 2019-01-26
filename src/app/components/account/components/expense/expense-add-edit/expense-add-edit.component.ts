import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { AccountService } from '../../../services';
import { BaseDataService, SystemService } from '../../../../../core/providers';
import { BaseData } from '../../../../../core/providers/base-data';
import { HttpClientService } from '../../../../../core/providers';
import { ExpenseService } from '../../../services';
import * as _ from 'lodash';
import * as moment from 'moment';
@Component({
  selector: 'expense-add-edit',
  templateUrl: './expense-add-edit.component.html',
  styleUrls: ['./expense-add-edit.component.scss']
})
export class ExpenseAddEditComponent implements AfterViewInit, OnDestroy {

  public editEvent;

  public addFlag = true;

  public editOrDelFlag = false;

  public baseData;
  public isAddressShow = false;
  public isExpenseCategory = false;
  public isFundParty = false;
  public isFundWay = false;
  public isFundAccount = false;

  public isLabelInputShow = false;
  public isPrticipanInputShow = false;

  public expenseDate;

  public expenseBook;

  public address;
  public addressItem;

  public expenseCategory;
  public expenseCategoryItem;
  public expenseCategoryList;

  public fundParty;
  public fundPartyItem;

  public fundWay;
  public fundWayItem;

  public fundAccount;
  public fundAccountItem;

  public participant;
  public participantItem;
  public participantList = [];

  public label;
  public labelItem;
  public labelList = [];

  public content;
  public amount;
  public memo;

  public expenseId;
  public expenseDetailId;
  public expenseBookId;
  public totalAmount;

  public expenseDetailList = [
    '内容', '参与人', '标签', '备注'
  ];

  public expenseDetail = this.expenseDetailList[0];
  constructor(
    public accountService: AccountService,
    public http: HttpClientService,
    public baseDataService: BaseDataService,
    public system: SystemService,
    public expenseService: ExpenseService
  ) {
    this.baseData = BaseData;
    this.expenseDate = moment().format('YYYY-MM-DD');
    this.expenseBook = this.baseData.expenseBookList[0];
    this.setAddress(_.find(BaseData.addressList, { isCurrenLive: 1 }))
  }

  ngAfterViewInit() {
    this.getExpenseCategoryList();
    this.editEvent = this.expenseService.editEvent.subscribe(async (data: any) => {

      this.expenseId = data.expense.id;
      this.expenseBookId = data.expense.expenseBookId;
      this.expenseDetailId = data.expenseDetail.id;
      this.totalAmount = data.expense.totalAmount;

      this.selectExpenseBook(this.baseDataService.getExpenseBook(data.expense.expenseBookId));

      this.addFlag = false;
      this.editOrDelFlag = true;

      this.expenseDate = moment(data.expense.expenseDate).format('YYYY-MM-DD');

      this.setAddress(this.baseDataService.getAddress(data.expenseDetail.addressId));

      this.setExpenseCategory(this.baseDataService.getExpenseCategory(data.expenseDetail.expenseCategoryId));

      this.setFundParty(this.baseDataService.getFundParty(data.expenseDetail.fundPartyId));

      this.setFundWay(this.baseDataService.getFundWay(data.expenseDetail.fundWayId));

      this.setFundAccount(this.baseDataService.getFundAccount(data.expenseDetail.fundAccountId));

      this.content = data.expenseDetail.content;

      this.amount = data.expenseDetail.amount;

      await this.getLableList();

      await this.getParticipantList();
    });

    this.participantList.push(_.find(BaseData.participantList, { isMyself: true }));
  }

  ngOnDestroy() {
    if (this.editEvent) {
      this.editEvent.unsubscribe();
    }
  }


  async getParticipantList() {
    this.participantList = [];
    const data: any = await this.http.get('/DR/ExpenseDetailParticipant?expenseDetailId=' + this.expenseDetailId);
    if (data && data.length) {
      for (const item of data) {
        this.participantList.push(this.baseDataService.getParticipant(item.participantId));
      }
    }
  }

  async getLableList() {
    this.labelList = [];
    const data: any = await this.http.get('/DR/ExpenseDetailLabel?expenseDetailId=' + this.expenseDetailId);
    if (data && data.length) {
      for (const item of data) {
        this.labelList.push(this.baseDataService.getLabel(item.labelId));
      }
    }
  }

  selectExpenseBook(item) {
    this.expenseBook = item;
    this.getExpenseCategoryList();
  }

  getExpenseCategoryList() {
    if (this.expenseBook) {
      this.expenseCategoryList = _.filter(BaseData.expenseCategoryList, { expenseBookId: this.expenseBook.id });
      this.expenseCategory = '';
      this.expenseCategoryItem = null;
    }
  }

  blur(value) {
    setTimeout(() => {
      this[value] = false;
    }, 300);
  }

  deleteLabel(item) {
    _.remove(this.labelList, item);
    this.baseDataService.addLable(item);
  }

  selecLabel(item) {
    this.labelList.push(item);
    this.baseDataService.deleteLabel(item);
    this.isLabelInputShow = false;
  }

  setParticipantItem(item) {
    this.participantList.push(item);
    this.participantItem = item;
    this.participant = item.name;
    this.isPrticipanInputShow = false;
  }

  deleteParticipant(item) {
    _.remove(this.participantList, item);
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
    this.address = item.province + '|' + item.city + '|' + item.area;
  }

  setExpenseCategory(item) {
    this.expenseCategoryItem = item;
    this.expenseCategory = item.name;
  }

  addLabel() {
    this.http.post('/DR/label', {
      type: 1,
      name: this.label,
      userId: this.system.user.id
    }).then((value: any) => {
      this.labelList.push(value);
      this.isLabelInputShow = false;
      this.baseDataService.addLable(value);
      this.label = '';
    });
  }

  cancel() {
    this.label = '';
    this.isLabelInputShow = false;
  }

  addParticipant() {
    this.accountService.changeComponent({ component: 'participant-add-edit' });
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

  selec(item) {
    this.expenseDetail = item;
  }

  init() {
    this.expenseDetail = '内容',
      this.content = '';
    this.amount = '';
    this.participantList = [];
    this.participantList.push(_.find(BaseData.participantList, { isMyself: true }));
  }


  reset() {
    this.expenseDate = '';
    this.addressItem = null;
    this.address = '';

    this.expenseCategoryItem = null;
    this.expenseCategory = '';

    this.fundPartyItem = null;
    this.fundParty = '';

    this.fundWayItem = null;
    this.fundWay = '';

    this.fundAccountItem = null;
    this.fundAccount = '';

    this.init();
    this.expenseDate = moment().format('YYYY-MM-DD');
    this.expenseBook = this.baseData.expenseBookList[0];
    this.setAddress(_.find(BaseData.addressList, { isCurrenLive: 1 }))
  }

  goAdd() {
    this.reset();
    this.addFlag = true;
    this.editOrDelFlag = false;
  }

  async addExpense() {
    try {
      this.expenseService.expense = {
        expenseDate: moment(this.expenseDate).format('YYYY-MM-DD'),
        userId: this.system.user.id,
        expenseBookId: this.expenseBook.id,
        totalAmount: this.amount
      };
      this.expenseService.expenseDetail = {
        content: this.content,
        amount: this.amount,
        memo: this.memo,
        addressId: this.addressItem.id,
        expenseCategoryId: this.expenseCategoryItem.id,
        fundPartyId: this.fundPartyItem.id,
        fundWayId: this.fundWayItem.id,
        fundAccountId: this.fundAccountItem.id
      };
      await this.expenseService.addExpense(this.participantList, this.labelList);
      if ((this.expenseService.expneseListDate !==
        moment(this.expenseDate).format('YYYY-MM-DD'))
        || (this.expenseBookId !== this.expenseBook.id)) {
        this.expenseService.expneseListDate = moment(this.expenseDate).format('YYYY-MM-DD'),
          this.accountService.changeComponent({ component: 'expense-list' });
      }
      this.init();
    } catch (error) {
      alert('添加账目失败：' + error);
    }
  }

  async editExpense() {
    try {
      this.expenseService.expense = {
        id: this.expenseId,
        expenseDate: moment(this.expenseDate).format('YYYY-MM-DD'),
        userId: this.system.user.id,
        expenseBookId: this.expenseBook.id,
        totalAmount: this.totalAmount
      };

      this.expenseService.expenseDetail = {
        id: this.expenseDetailId,
        expenseId: this.expenseId,
        content: this.content,
        amount: this.amount,
        memo: this.memo,
        addressId: this.addressItem.id,
        expenseCategoryId: this.expenseCategoryItem.id,
        fundPartyId: this.fundPartyItem.id,
        fundWayId: this.fundWayItem.id,
        fundAccountId: this.fundAccountItem.id
      };

      await this.expenseService.editExpense(this.participantList, this.labelList);

      this.expenseService.expneseListDate = moment(this.expenseDate).format('YYYY-MM-DD'),
        this.accountService.changeComponent({ component: 'expense-list' });

      this.expenseService.init();

      this.reset();
      this.goAdd();
    } catch (error) {
      alert('编辑账目失败:' + error);
    }
  }


  async delExpense() {
    try {
      await this.expenseService.deleteExpenseDetail(this.expenseDetailId);
      this.reset();
      this.goAdd();
      _.remove(this.expenseService.expenseDetailList, { id: this.expenseDetailId });
      if (this.expenseService.expenseDetailList.length) {
        this.expenseService.groupDetailList();
      } else {
        _.remove(this.expenseService.expenseList, { id: this.expenseId });
        this.accountService.changeComponent({ component: 'expense-list' });
      }
    } catch (error) {
      alert('删除账目失败:' + error);
    }
  }
}
