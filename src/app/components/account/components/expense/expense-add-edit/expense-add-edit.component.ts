import { Component, OnInit, OnDestroy, AfterViewInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { AccountService } from '../../../services';
import { BaseDataService, SystemService, NotifyService, HttpClientService } from '../../../../../core/providers';
import { BaseData } from '../../../../../core/providers/base-data';

import { ExpenseService } from '../../../services';

import { Expense, ExpenseDetail } from '../../../models';
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

  formChanges: Subscription;

  expense: Expense = {
    id: '',
    userId: this.system.user.id,
    expenseBookId: '',
    expenseDate: moment().format('YYYY-MM-DD'),
    totalAmount: 0
  };

  expenseDetail: ExpenseDetail = {
    id: '',
    expenseId: this.expense.id,
    addressId: null,
    expenseCategoryId: '',
    fundPartyId: '',
    fundChannelId: '',
    fundAccountId: '',
    content: '',
    amount: '',
    memo: ''
  };

  public editEvent;

  public addFlag = true;

  public editOrDelFlag = false;

  public expenseBook;

  public participantList = [];

  public labelList = [];

  expenseForm = this.fb.group({
    expenseDate: [this.expense.expenseDate],
    address: [this.expenseDetail.addressId, Validators.required],
    expenseCategory: [this.expenseDetail.expenseCategoryId, Validators.required],
    fundParty: [this.expenseDetail.fundPartyId, Validators.required],
    fundChannel: [this.expenseDetail.fundChannelId, Validators.required],
    fundAccount: [this.expenseDetail.fundAccountId, Validators.required],
    content: [this.expenseDetail.content, Validators.required],
    amount: [this.expenseDetail.amount, Validators.required],
    memo: [this.expenseDetail.memo]
  });

  public changeTabViewEvent: Subscription;

  constructor(
    public accountService: AccountService,
    public http: HttpClientService,
    public baseDataService: BaseDataService,
    public system: SystemService,
    public expenseService: ExpenseService,
    public notifyService: NotifyService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.system.tabViewList = new Map([
      ['expenseDate', '日期'],
      ['address', '支出地点'],
      ['expenseCategory', '类别'],
      ['fundParty', '商家'],
      ['fundChannel', '渠道'],
      ['fundAccount', '账户'],
      ['content', '支出内容'],
      ['amount', '支出金额'],
      ['participant', '参与'],
      ['label', '标签'],
      ['memo', '备注']
    ]);

    this.formChanges = this.expenseForm.get('expenseDate').valueChanges.subscribe((data) => {
      if (data) {
        this.expense.expenseDate = data.date;
      }
    });
  }

  setFundAccount(data) {
    if (data.title && data.value) {
      this.expenseDetail.fundAccountId = data.value;
    }
  }

  onSetExpenseBook(item) {
    if (item) {
      this.expenseBook = item;
      this.expense.expenseBookId = item.id;
    }
  }

  onSetParticipantList(participantList) {
    this.participantList = participantList;
  }

  ngAfterViewInit() {
    this.reset();
    this.editEvent = this.expenseService.editEvent.subscribe(async (data: any) => {
      this.expense = data.expense;
      this.expenseDetail = data.expenseDetail;
      this.addFlag = false;
      this.editOrDelFlag = true;
      await this.getLableList();
      await this.getParticipantList();
    });

    this.changeTabViewEvent = this.system.changeTabViewEvent.subscribe((value) => {
      if (value === '支出内容') {
        this.system.selectedTabView = value;
        this.contentInputEle.nativeElement.focus();
      } else if (value === '支出金额') {
        this.system.selectedTabView = value;
        this.amountInputEle.nativeElement.focus();
      }
    });
  }

  @HostListener('click', ['$event'])
  onClick() {
    if (this.contentInputEle.nativeElement.contains(event.target)) {
      this.system.selectedTabView = '支出内容';
    }

    if (this.amountInputEle.nativeElement.contains(event.target)) {
      this.system.selectedTabView = '支出金额';
    }
  }

  @HostListener('body:keyup', ['$event'])
  hotKeyEvent(e) {
    switch (e.keyCode) {
      case 9:
        this.tabCustomInput(e);
        break;
      case 13:
        if (this.addFlag) {
          this.addExpense();
        }
        if (this.editOrDelFlag) {
          this.editExpense();
        }
        break;
      // delete
      case 46:
        if (this.editOrDelFlag) {
          this.delExpense();
        }
        break;
      default:
        break;
    }
  }

  tabCustomInput(e?) {
    const values = Array.from(this.system.tabViewList.values());
    if (this.system.selectedTabView && e) {
      const index = _.findIndex(values, (item) => {
        return item === this.system.selectedTabView;
      });
      if ((index > -1) && (index <= values.length - 1)) {
        this.system.changeTabView((e.shiftKey ? values[index - 1] : values[index + 1]) || values[0]);
      }
    } else {
      const object = Object.assign(this.expenseForm.value);
      for (const property in object) {
        if (!this.expenseForm.value[property]) {
          const tabView = this.system.tabViewList.get(property);
          this.system.changeTabView(tabView);
          break;
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

    if (this.formChanges) {
      this.formChanges.unsubscribe();
    }
    this.system.tabViewList = new Map();
  }

  onSetLabelList(labelList) {
    this.labelList = labelList;
  }

  async getParticipantList() {
    const list = [];
    const data: any = await this.http.get('/DR/ExpenseDetailParticipant?expenseDetailId=' + this.expenseDetail.id);
    if (data && data.length) {
      for (const item of data) {
        list.push(this.baseDataService.getParticipant(item.participantId));
      }
    }
    this.participantList = list;
  }

  async getLableList() {
    this.labelList = [];
    const data: any = await this.http.get('/DR/ExpenseDetailLabel?expenseDetailId=' + this.expenseDetail.id);
    if (data && data.length) {
      for (const item of data) {
        this.labelList.push(this.baseDataService.getLabel(item.labelId));
      }
    }
  }

  // 添加账目的时候把内容和金额进行充值，免得重复选择其他东西
  init() {
    this.expenseForm.patchValue({
      content: '',
      amount: '',
      memo: ''
    });
    this.participantList = [];
    this.participantList.push(_.find(BaseData.participantList, { isMyself: true }));
    this.labelList = [];
    this.system.selectedTabView = '支出内容';
    this.contentInputEle.nativeElement.focus();
    this.expenseForm.markAsPristine();
  }

  reset() {
    this.expenseForm.patchValue({
      expenseDate: moment().format('YYYY-MM-DD'),
      address: '',
      expenseCategory: '',
      fundParty: '',
      fundChannel: '',
      fundAccount: '',
      content: '',
      amount: '',
      memo: '',
    });
    this.system.selectedTabView = null;
    this.participantList = [];
    this.participantList.push(_.find(BaseData.participantList, { isMyself: true }));
    this.labelList = [];
    this.expenseForm.markAsPristine();
  }

  goAdd() {
    this.reset();
    this.addFlag = true;
    this.editOrDelFlag = false;
  }

  async addExpense() {
    if (!this.expenseForm.valid) {
      for (const item in this.expenseForm.controls) {
        this.expenseForm.get(item).markAsTouched();
      }
      return;
    }
    try {
      delete this.expense.id;
      delete this.expenseDetail.expenseId;
      delete this.expenseDetail.id;
      this.expense.totalAmount = this.expenseDetail.amount;
      await this.expenseService.addExpense(this.expense, this.expenseDetail, this.participantList, this.labelList);
      this.init();
      this.system.update();
      this.notifyService.notify('添加支出账目', 'success');
      this.expenseService.expneseListDate = moment(this.expense.expenseDate).format('YYYY-MM-DD');
      this.system.changeComponent({ component: 'expense-detail', data: this.expense });
    } catch (error) {
      this.notifyService.notify('添加支出账目失败', 'error');
    }
  }

  async editExpense() {
    if (!this.expenseForm.valid) {
      for (const item in this.expenseForm.controls) {
        this.expenseForm.get(item).markAsTouched();
      }
      return;
    }
    try {
      this.expense.expenseDate = moment(this.expense.expenseDate).format('YYYY-MM-DD');
      await this.expenseService.editExpense(this.expense, this.expenseDetail, this.participantList, this.labelList);
      this.goAdd();
      this.system.update();
      this.notifyService.notify('编辑支出账目', 'success');
      this.expenseService.expneseListDate = moment(this.expense.expenseDate).format('YYYY-MM-DD');
      this.system.changeComponent({ component: 'expense-detail', data: this.expense });
      this.expenseService.init();
    } catch (error) {
      this.notifyService.notify('编辑支出账目失败', 'error');
    }
  }

  async delExpense() {
    try {
      await this.expenseService.deleteExpenseDetail(this.expense, this.expenseDetail.id, this.expenseDetail.amount);
      this.system.update();
      this.goAdd();
      _.remove(this.expenseService.expenseDetailList, { id: this.expenseDetail.id });
      if (this.expenseService.expenseDetailList.length) {
        this.expenseService.groupDetailList();
      } else {
        _.remove(this.expenseService.expenseList, { id: this.expense.id });
        this.system.changeComponent({ component: 'expense-list' });
      }
      this.notifyService.notify('删除支出账目', 'success');
    } catch (error) {
      this.notifyService.notify('删除支出账目失败', 'error');
    }
  }
}
