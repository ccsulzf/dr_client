import { Component, OnInit, OnDestroy, AfterViewInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { IncomeService } from '../../../services/income.service';
import { SystemService, HttpClientService, BaseData } from '../../../../../core/providers';

import { Subscription } from 'rxjs';
import * as moment from 'moment';
import * as _ from 'lodash';
@Component({
  selector: 'income-add-edit',
  templateUrl: './income-add-edit.component.html',
  styleUrls: ['./income-add-edit.component.scss']
})
export class IncomeAddEditComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('amountInputEle') amountInputEle: ElementRef;
  public editEvent;

  incomeId;
  addressId;
  incomeCategoryId;
  fundPartyId;
  amount;
  fundChannelId;
  fundAccountId;
  startDate = moment().format('YYYY-MM-DD');
  endDate = moment().format('YYYY-MM-DD');
  memo;

  participantList = [];
  labelList = [];

  public addFlag = true;
  public editOrDelFlag = false;

  public changeTabViewEvent: Subscription;
  constructor(
    public accountService: AccountService,
    public incomeService: IncomeService,
    public system: SystemService,
    public http: HttpClientService
  ) { }

  ngOnInit() {
    this.editEvent = this.incomeService.editEvent.subscribe(async (data: any) => {
      this.incomeId = data.id;
      this.addressId = data.addressId;
      this.fundPartyId = data.fundPartyId;
      this.incomeCategoryId = data.incomeCategoryId;
      this.amount = data.amount;
      this.fundChannelId = data.fundChannelId;
      this.fundAccountId = data.fundAccountId;

      this.startDate = moment(data.startDate).format('YYYY-MM-DD');
      this.endDate = moment(data.endDate).format('YYYY-MM-DD');

      this.http.get('/DR/IncomeLabel?incomeId=' + data.id).then((list: any) => {
        this.labelList = [];
        if (list && list.length) {
          for (const item of list) {
            this.labelList.push(_.find(BaseData.labelList, { id: item.labelId }));
          }
        }
      });

      this.http.get('/DR/IncomeParticipant?incomeId=' + data.id).then((list: any) => {
        this.participantList = [];
        if (list && list.length) {
          for (const item of list) {
            this.participantList.push(_.find(BaseData.participantList, { id: item.participantId }));
          }
        }
      });
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

  ngAfterViewInit() {
    const array = Array.from(this.system.tabViewList);
    const index = _.findIndex(array, (value) => {
      return value === '收入类别';
    });
    array.splice(index + 1, 0, '收款金额');
    this.system.tabViewList = new Set(array);
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
  }

  onSetAddress(addressId) {
    this.addressId = addressId;
  }

  onSetCategory(incomeCategoryId) {
    this.incomeCategoryId = incomeCategoryId;
  }

  onSetFundParty(fundPartyId) {
    this.fundPartyId = fundPartyId;
  }

  onSetMemo(memo) {
    this.memo = memo;
  }

  onSetParticipantList(participantList) {
    this.participantList = participantList;
  }

  onSetLabelList(labelList) {
    this.labelList = labelList;
  }

  onSetsetFundChannel(fundChannelId) {
    this.fundChannelId = fundChannelId;
  }

  onSetFundAccount(fundAccountId) {
    this.fundAccountId = fundAccountId;
  }

  onSetDate(data) {
    if (data.name === '开始日期') {
      this.startDate = data.date;
    }
    if (data.name === '结束日期') {
      this.endDate = data.date;
    }
  }

  async add() {
    this.incomeService.income = {
      userId: this.system.user.id,
      addressId: this.addressId,
      incomeCategoryId: this.incomeCategoryId,
      fundPartyId: this.fundPartyId,
      amount: this.amount,
      fundChannelId: this.fundChannelId,
      fundAccountId: this.fundAccountId,
      startDate: this.startDate,
      endDate: this.endDate,
      memo: this.memo,
    };
    await this.incomeService.add(this.participantList, this.labelList);
    this.reset();
  }

  async edit() {
    this.incomeService.income = {
      id: this.incomeId,
      userId: this.system.user.id,
      addressId: this.addressId,
      incomeCategoryId: this.incomeCategoryId,
      fundPartyId: this.fundPartyId,
      amount: this.amount,
      fundChannelId: this.fundChannelId,
      fundAccountId: this.fundAccountId,
      startDate: this.startDate,
      endDate: this.endDate,
      memo: this.memo,
    };
    this.reset();
    await this.incomeService.editIncome(this.participantList, this.labelList);
  }

  async del() {
    await this.incomeService.deleteIncome(this.incomeId, this.fundAccountId);
    this.reset();
  }

  reset() {
    this.amount = '';
    this.startDate = moment().format('YYYY-MM-DD');
    this.endDate = moment().format('YYYY-MM-DD');
    this.system.reset();
  }

  goAdd() {
    this.addFlag = true;
    this.editOrDelFlag = false;
    this.reset();
  }
}
