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
export class ExpenseAddEditComponent implements OnInit, AfterViewInit, OnDestroy {

  public addressId;

  public expenseCategoryId = 3;

  public fundPartyId;

  public fundChannelId;

  public fundAccountId;

  public editEvent;

  public addFlag = true;

  public editOrDelFlag = false;

  public baseData;

  public expenseDate;

  public expenseBook;

  public participantList = [];

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

  }

  ngOnInit() {
    this.baseData = BaseData;
    this.expenseDate = moment().format('YYYY-MM-DD');
    this.expenseBook = this.baseData.expenseBookList[0];
  }

  onSetAddress(addressId) {
    this.addressId = addressId;
  }

  onSetCategory(expenseCategoryId) {
    this.expenseCategoryId = expenseCategoryId;
  }

  onSetFundParty(fundPartyId) {
    this.fundPartyId = fundPartyId;
  }

  onSetsetFundChannel(fundChannelId) {
    this.fundChannelId = fundChannelId;
  }

  onSetFundAccount(fundAccountId) {
    this.fundAccountId = fundAccountId;
  }

  onSetParticipantList(participantList) {
    this.participantList = participantList;
  }

  ngAfterViewInit() {
    this.editEvent = this.expenseService.editEvent.subscribe(async (data: any) => {
      this.expenseId = data.expense.id;
      this.expenseBookId = data.expense.expenseBookId;
      this.expenseDetailId = data.expenseDetail.id;
      this.totalAmount = data.expense.totalAmount;

      this.selectExpenseBook(this.baseDataService.getExpenseBook(data.expense.expenseBookId));

      this.addFlag = false;
      this.editOrDelFlag = true;

      this.expenseDate = moment(data.expense.expenseDate).format('YYYY-MM-DD');

      this.addressId = data.expenseDetail.addressId;

      this.expenseCategoryId = data.expenseDetail.expenseCategoryId;

      this.fundPartyId = data.expenseDetail.fundPartyId;

      this.fundChannelId = data.expenseDetail.fundChannelId;

      this.fundAccountId = data.expenseDetail.fundAccountId;

      this.content = data.expenseDetail.content;

      this.amount = data.expenseDetail.amount;

      await this.getLableList();

      await this.getParticipantList();
    });
  }

  ngOnDestroy() {
    if (this.editEvent) {
      this.editEvent.unsubscribe();
    }
  }


  addExpenseBook() {
    this.system.changeComponent({ component: 'expenseBook-add-edit' });
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
  }

  select(item) {
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
    this.init();
    this.expenseDate = moment().format('YYYY-MM-DD');
    this.expenseBook = this.baseData.expenseBookList[0];
    this.system.reset();
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
        addressId: this.addressId,
        expenseCategoryId: this.expenseCategoryId,
        fundPartyId: this.fundPartyId,
        fundChannelId: this.fundChannelId,
        fundAccountId: this.fundAccountId
      };
      await this.expenseService.addExpense(this.participantList, this.labelList);
      if ((this.expenseService.expneseListDate !==
        moment(this.expenseDate).format('YYYY-MM-DD'))
        || (this.expenseBookId !== this.expenseBook.id)) {
        this.expenseService.expneseListDate = moment(this.expenseDate).format('YYYY-MM-DD'),
          this.system.changeComponent({ component: 'expense-list' });
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
        addressId: this.addressId,
        expenseCategoryId: this.expenseCategoryId,
        fundPartyId: this.fundPartyId,
        fundChannelId: this.fundChannelId,
        fundAccountId: this.fundAccountId
      };

      await this.expenseService.editExpense(this.participantList, this.labelList);

      this.expenseService.expneseListDate = moment(this.expenseDate).format('YYYY-MM-DD'),
        this.system.changeComponent({ component: 'expense-list' });

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
        this.system.changeComponent({ component: 'expense-list' });
      }
    } catch (error) {
      alert('删除账目失败:' + error);
    }
  }
}
