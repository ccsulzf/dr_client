import { Component, OnInit, OnDestroy, AfterViewInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { AccountService } from '../../../services';
import { BaseDataService, SystemService, NotifyService, HttpClientService } from '../../../../../core/providers';
import { BaseData } from '../../../../../core/providers/base-data';

import { IncomeService } from '../../../services';

import { Subscription } from 'rxjs';
import * as moment from 'moment';
import * as _ from 'lodash';

import { Income } from '../../../models';
@Component({
  selector: 'income-add-edit',
  templateUrl: './income-add-edit.component.html',
  styleUrls: ['./income-add-edit.component.scss']
})
export class IncomeAddEditComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('amountInputEle') amountInputEle: ElementRef;

  startDateChanges: Subscription;
  endDateChanges: Subscription;
  income: Income = {
    id: '',
    userId: this.system.user.id,
    incomeCategoryId: '',
    addressId: '',
    fundPartyId: '',
    fundChannelId: '',
    fundAccountId: '',
    startDate: moment().format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
    amount: '',
    memo: '',
  };

  participantList = [];
  labelList = [];

  public editEvent;

  public addFlag = true;
  public editOrDelFlag = false;

  public changeTabViewEvent: Subscription;

  public dateTypeList = [
    { name: '日度', viewType: 'day' },
    { name: '月度', viewType: 'month' },
    { name: '年度', viewType: 'year' }
  ];

  public selectedDateType = this.dateTypeList[0].viewType;

  incomeForm = this.fb.group({
    incomeCategory: [this.income.incomeCategoryId, Validators.required],
    address: [this.income.addressId, Validators.required],
    fundParty: [this.income.fundPartyId, Validators.required],
    fundChannel: [this.income.fundChannelId, Validators.required],
    fundAccount: [this.income.fundAccountId, Validators.required],
    selectedDateType: [this.selectedDateType],
    startDate: [this.income.startDate],
    endDate: [this.income.endDate],
    amount: [this.income.amount, Validators.required],
    memo: [this.income.memo]
  });
  constructor(
    public accountService: AccountService,
    public incomeService: IncomeService,
    public system: SystemService,
    public http: HttpClientService,
    public notifyService: NotifyService,
    private fb: FormBuilder,
    public baseDataService: BaseDataService
  ) { }

  ngOnInit() {

    this.system.tabViewList = new Map([
      ['address', '地点'],
      ['fundParty', '付款方'],
      ['incomeCategory', '收入类别'],
      ['amount', '收入金额'],
      ['fundChannel', '收款渠道'],
      ['fundAccount', '存入账户'],
      ['startDate', '开始日期'],
      ['endDate', '结束日期'],
      ['participant', '参与'],
      ['label', '标签'],
      ['memo', '备注']
    ]);
    // this.startDateChanges = this.incomeForm.get('startDate').valueChanges.subscribe((data) => {
    //   if (data) {
    //     this.income.startDate = data.date;
    //   }
    // });

    // this.endDateChanges = this.incomeForm.get('endDate').valueChanges.subscribe((data) => {
    //   if (data) {
    //     this.income.endDate = data.date;
    //   }
    // });
  }

  ngAfterViewInit() {
    this.reset();
    this.editEvent = this.incomeService.editEvent.subscribe(async (data: any) => {
      this.income = data.income;
      await this.getLableList();
      await this.getParticipantList();
      this.addFlag = false;
      this.editOrDelFlag = true;
    });

    this.changeTabViewEvent = this.system.changeTabViewEvent.subscribe((value) => {
      if (value === '收款金额') {
        this.system.selectedTabView = value;
        this.amountInputEle.nativeElement.focus();
      } else {
        this.amountInputEle.nativeElement.blur();
      }
    });
  }


  async getParticipantList() {
    this.participantList = [];
    const data: any = await this.http.get('/DR/IncomeParticipant?incomeId=' + this.income.id);
    if (data && data.length) {
      for (const item of data) {
        this.participantList.push(this.baseDataService.getParticipant(item.participantId));
      }
    }
  }

  async getLableList() {
    this.labelList = [];
    const data: any = await this.http.get('/DR/IncomeLabel?incomeId=' + this.income.id);
    if (data && data.length) {
      for (const item of data) {
        this.labelList.push(this.baseDataService.getLabel(item.labelId));
      }
    }
  }

  selectDateType(viewType) {
    this.selectedDateType = viewType;
    switch (this.selectedDateType) {
      case 'day':
        this.income.startDate = moment().format('YYYY-MM-DD');
        this.income.endDate = moment().format('YYYY-MM-DD');
        break;
      case 'month':
        this.income.startDate = moment().format('YYYY-MM');
        this.income.endDate = moment().format('YYYY-MM');
        break;
      case 'year':
        this.income.startDate = moment().format('YYYY');
        this.income.endDate = moment().format('YYYY');
        break;
      default:
        break;
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

    if (this.startDateChanges) {
      this.startDateChanges.unsubscribe();
    }

    if (this.endDateChanges) {
      this.endDateChanges.unsubscribe();
    }
  }



  onSetParticipantList(participantList) {
    this.participantList = participantList;
  }

  onSetLabelList(labelList) {
    this.labelList = labelList;
  }

  onSetDate(data) {
    // console.info(data);
    if (data.name === '开始日期') {
      this.income.startDate = data.date;
    }
    if (data.name === '结束日期') {
      this.income.endDate = data.date;
    }
  }

  async add() {
    try {
      console.info(this.income);
      // await this.incomeService.add(this.income, this.participantList, this.labelList);
      // this.notifyService.notify('添加收入', 'success');
      // this.reset();
    } catch (error) {
      this.notifyService.notify('添加收入失败', 'error');
    }

  }

  async edit() {
    try {
      // await this.incomeService.editIncome(this.income, this.participantList, this.labelList);
      // this.reset();
      // this.notifyService.notify('编辑收入', 'success');
    } catch (error) {
      this.notifyService.notify('编辑收入失败', 'error');
    }
  }

  async del() {
    try {
      await this.incomeService.deleteIncome(this.income.id, this.income.fundAccountId);
      this.reset();
      this.notifyService.notify('删除收入', 'success');
    } catch (error) {
      this.notifyService.notify('删除收入失败', 'error');
    }
  }

  reset() {
    this.incomeForm.patchValue({
      address: '',
      incomeCategory: '',
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
    this.incomeForm.markAsPristine();
  }

  goAdd() {
    this.addFlag = true;
    this.editOrDelFlag = false;
    this.reset();
  }
}
