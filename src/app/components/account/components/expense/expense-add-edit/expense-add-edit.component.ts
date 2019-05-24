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
    this.formChanges = this.expenseForm.get('expenseDate').valueChanges.subscribe((data) => {
      if (data) {
        this.expense.expenseDate = data.date;
      }
    });
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

    this.system.tabViewList.add('支出内容');
    this.system.tabViewList.add('支出金额');

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
        const array = Array.from(this.system.tabViewList);
        if (this.system.selectedTabView) {
          const index = _.findIndex(array, (item) => {
            return item === this.system.selectedTabView;
          });
          if ((index > -1) && (index <= array.length - 1)) {
            this.system.changeTabView((e.shiftKey ? array[index - 1] : array[index + 1]) || array[0]);
          }
        }
        break;
      // enter
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
    this.system.tabViewList = new Set();
  }

  onSetLabelList(labelList) {
    this.labelList = labelList;
  }

  async getParticipantList() {
    this.participantList = [];
    const data: any = await this.http.get('/DR/ExpenseDetailParticipant?expenseDetailId=' + this.expenseDetail.id);
    if (data && data.length) {
      for (const item of data) {
        this.participantList.push(this.baseDataService.getParticipant(item.participantId));
      }
    }
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
    // this.system.selectedTabView = '支出内容';
    // this.contentInputEle.nativeElement.focus();
    this.expenseForm.markAsPristine();
  }

  reset() {
    this.expenseForm.patchValue({
      address: '',
      fundAccount: '',
      fundParty: '',
      fundChannel: '',
      expenseCategory: '',
      expenseDate: moment().format('YYYY-MM-DD')
    });
    this.init();
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
      this.expense.totalAmount = this.expenseDetail.amount;
      await this.expenseService.addExpense(this.expense, this.expenseDetail, this.participantList, this.labelList);
      this.notifyService.notify('添加支出账目', 'success');
      if ((this.expenseService.expneseListDate !==
        moment(this.expense.expenseDate).format('YYYY-MM-DD'))
        || (this.expense.expenseBookId !== this.expenseBook.id)) {
        this.expenseService.expneseListDate = moment(this.expense.expenseDate).format('YYYY-MM-DD'),
          this.system.changeComponent({ component: 'expense-list' });
      }
      this.init();
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
      this.notifyService.notify('编辑支出账目', 'success');
      this.expenseService.expneseListDate = moment(this.expense.expenseDate).format('YYYY-MM-DD'),
        this.system.changeComponent({ component: 'expense-list' });
      this.expenseService.init();
      this.reset();
      this.goAdd();
    } catch (error) {
      this.notifyService.notify('编辑支出账目失败', 'error');
    }
  }

  async delExpense() {
    try {
      await this.expenseService.deleteExpenseDetail(this.expense, this.expenseDetail.id, this.expenseDetail.amount);
      this.reset();
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
