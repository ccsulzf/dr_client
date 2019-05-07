import { Component, OnInit, OnDestroy, AfterViewInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { AccountService } from '../../../services';
import { BaseDataService, SystemService } from '../../../../../core/providers';
import { BaseData } from '../../../../../core/providers/base-data';
import { HttpClientService } from '../../../../../core/providers';
import { ExpenseService } from '../../../services';
import * as _ from 'lodash';
import * as moment from 'moment';

import { Subscription } from 'rxjs';
@Component({
  selector: 'expense-add-edit',
  templateUrl: './expense-add-edit.component.html',
  styleUrls: ['./expense-add-edit.component.scss']
})
export class ExpenseAddEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('contentInputEle') contentInputEle: ElementRef;
  @ViewChild('amountInputEle') amountInputEle: ElementRef;
  public addressId;

  public expenseCategoryId;

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
  public memo = '';

  public expenseId;
  public expenseDetailId;
  public expenseBookId;
  public totalAmount;

  public changeTabViewEvent: Subscription;
  constructor(
    public accountService: AccountService,
    public http: HttpClientService,
    public baseDataService: BaseDataService,
    public system: SystemService,
    public expenseService: ExpenseService
  ) { }

  ngOnInit() {
    this.baseData = BaseData;
    this.expenseDate = moment().format('YYYY-MM-DD');
  }

  onSetDate(data) {
    this.expenseDate = moment(data.date).format('YYYY-MM-DD');
  }

  onSetExpenseBook(item) {
    if (item) {
      this.expenseBook = item;
      this.expenseBookId = item.id;
    }
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

      this.addFlag = false;
      this.editOrDelFlag = true;

      this.expenseDate = moment(data.expense.expenseDate).format('YYYY-MM-DD');

      this.addressId = data.expenseDetail.addressId;

      this.expenseCategoryId = data.expenseDetail.expenseCategoryId;

      this.fundPartyId = data.expenseDetail.fundPartyId;

      this.fundChannelId = data.expenseDetail.fundChannelId;

      this.fundAccountId = data.expenseDetail.fundAccountId;

      this.content = data.expenseDetail.content;

      this.amount = Number(data.expenseDetail.amount);

      await this.getLableList();

      await this.getParticipantList();
    });

    this.system.tabViewList.add('支出内容');
    this.system.tabViewList.add('支出金额');

    this.changeTabViewEvent = this.system.changeTabViewEvent.subscribe((value) => {
      if (value === '支出内容') {
        this.system.selectedTabView = value;
        this.contentInputEle.nativeElement.focus();
        this.amountInputEle.nativeElement.blur();
      } else if (value === '支出金额') {
        this.system.selectedTabView = value;
        this.amountInputEle.nativeElement.focus();
        this.contentInputEle.nativeElement.blur();
      } else {
        this.contentInputEle.nativeElement.blur();
        this.amountInputEle.nativeElement.blur();
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onClick() {
    if (this.contentInputEle.nativeElement.contains(event.target)) {
      this.system.selectedTabView = '支出内容';
    }

    if (this.amountInputEle.nativeElement.contains(event.target)) {
      this.system.selectedTabView = '支出金额';
    }
  }


  @HostListener('body:keyup', ['$event'])
  keyUp(e) {
    if (e.keyCode === 9) {
      const array = Array.from(this.system.tabViewList);
      if (this.system.selectedTabView) {
        const index = _.findIndex(array, (item) => {
          return item === this.system.selectedTabView;
        });
        if ((index > -1) && (index <= array.length - 1)) {
          this.system.changeTabView(array[index + 1] || array[0]);
        }
      }
    }
  }

  ngOnDestroy() {
    if (this.editEvent) {
      this.editEvent.unsubscribe();
    }
    if (this.changeTabViewEvent) {
      this.changeTabViewEvent.unsubscribe();
    }
  }

  onSetLabelList(labelList) {
    this.labelList = labelList;
  }

  onSetMemo(memo) {
    this.memo = memo;
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

  // 添加账目的时候把内容和金额进行充值，免得重复选择其他东西
  init() {
    this.content = '';
    this.amount = '';
    this.memo = '';
    this.participantList = [];
    this.participantList.push(_.find(BaseData.participantList, { isMyself: true }));
    this.labelList = [];
  }


  reset() {
    this.expenseBookId = '';
    this.addressId = '';
    this.fundAccountId = '';
    this.fundPartyId = '';
    this.init();
    this.expenseDate = moment().format('YYYY-MM-DD');
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
