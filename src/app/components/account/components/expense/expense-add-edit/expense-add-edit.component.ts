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

  public memo = '';

  expenseForm = this.fb.group({
    expenseDate: [this.expense.expenseDate],
    address: [this.expenseDetail.addressId, Validators.required],
    expenseCategory: [this.expenseDetail.expenseCategoryId, Validators.required],
    fundParty: [this.expenseDetail.fundPartyId, Validators.required],
    fundChannel: [this.expenseDetail.fundChannelId, Validators.required],
    fundAccount: [this.expenseDetail.fundAccountId, Validators.required],
    content: [this.expenseDetail.content, Validators.required],
    amount: [this.expenseDetail.amount, Validators.required]
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

  // onSetDate(data) {
  //   if (data) {
  //     this.expense.expenseDate = data.date;
  //   }
  // }

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
            this.system.changeTabView(array[index + 1] || array[0]);
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

  onSetMemo(memo) {
    this.expenseDetail.memo = memo;
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
    });
    this.participantList = [];
    this.participantList.push(_.find(BaseData.participantList, { isMyself: true }));
    this.labelList = [];
    this.memo = '';
    this.system.selectedTabView = '支出内容';
    this.contentInputEle.nativeElement.focus();
    this.expenseForm.markAsPristine();
  }

  reset() {
    this.expenseForm.patchValue({
      address: '',
      fundAccount: '',
      fundParty: '',
      expenseDate: moment().format('YYYY-MM-DD')
    });
    this.init();
    // this.expense.expenseBookId = '';
    // this.addressId = '';
    // this.fundAccountId = '';
    // this.fundPartyId = '';
    // this.init();
    // this.expenseDate = moment().format('YYYY-MM-DD');
  }

  goAdd() {
    this.reset();
    this.addFlag = true;
    this.editOrDelFlag = false;
  }

  async addExpense() {
    console.info('----add----');
    // console.info(this.expense);
    console.info(this.expenseDetail);
    // console.info(this.expenseForm.value);
    if (!this.expenseForm.valid) {
      for (const item in this.expenseForm.controls) {
        this.expenseForm.get(item).markAsTouched();
      }
      return;
    }
    // try {
    //   await this.expenseService.addExpense(this.expense, this.expenseDetail, this.participantList, this.labelList);
    //   this.notifyService.notify('添加支出账目', 'success');
    //   if ((this.expenseService.expneseListDate !==
    //     moment(this.expense.expenseDate).format('YYYY-MM-DD'))
    //     || (this.expense.expenseBookId !== this.expenseBook.id)) {
    //     this.expenseService.expneseListDate = moment(this.expense.expenseDate).format('YYYY-MM-DD'),
    //       this.system.changeComponent({ component: 'expense-list' });
    //   }
    //   this.init();
    // } catch (error) {
    //   this.notifyService.notify('添加支出账目失败', 'error');
    // }
  }

  async editExpense() {
    console.info('----edit----');
    console.info(this.expense);

    console.info(this.expenseDetail);
    // try {
    //   this.expenseService.expense = {
    //     id: this.expenseId,
    //     expenseDate: moment(this.expenseDate).format('YYYY-MM-DD'),
    //     userId: this.system.user.id,
    //     expenseBookId: this.expenseBook.id,
    //     totalAmount: this.totalAmount
    //   };

    //   this.expenseService.expenseDetail = {
    //     id: this.expenseDetailId,
    //     expenseId: this.expenseId,
    //     content: this.content,
    //     amount: this.amount,
    //     memo: this.memo,
    //     addressId: this.addressId,
    //     expenseCategoryId: this.expenseCategoryId,
    //     fundPartyId: this.fundPartyId,
    //     fundChannelId: this.fundChannelId,
    //     fundAccountId: this.fundAccountId
    //   };

    //   await this.expenseService.editExpense(this.participantList, this.labelList);
    //   this.notifyService.notify('编辑支出账目', 'success');
    //   this.expenseService.expneseListDate = moment(this.expenseDate).format('YYYY-MM-DD'),
    //     this.system.changeComponent({ component: 'expense-list' });

    //   this.expenseService.init();

    //   this.reset();
    //   this.goAdd();
    // } catch (error) {
    //   this.notifyService.notify('编辑支出账目失败', 'error');
    // }
  }

  async delExpense() {
    // try {
    //   await this.expenseService.deleteExpenseDetail(this.expenseDetailId, this.amount);
    //   this.reset();
    //   this.goAdd();
    //   _.remove(this.expenseService.expenseDetailList, { id: this.expenseDetailId });
    //   if (this.expenseService.expenseDetailList.length) {
    //     this.expenseService.groupDetailList();
    //   } else {
    //     _.remove(this.expenseService.expenseList, { id: this.expenseId });
    //     this.system.changeComponent({ component: 'expense-list' });
    //   }
    //   this.notifyService.notify('删除支出账目', 'success');
    // } catch (error) {
    //   this.notifyService.notify('删除支出账目失败', 'error');
    // }
  }
}
