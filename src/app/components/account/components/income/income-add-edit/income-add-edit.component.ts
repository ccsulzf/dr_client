import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { IncomeService } from '../../../services/income.service';
import { SystemService, HttpClientService, BaseData } from '../../../../../core/providers';
import * as moment from 'moment';
import * as _ from 'lodash';
@Component({
  selector: 'income-add-edit',
  templateUrl: './income-add-edit.component.html',
  styleUrls: ['./income-add-edit.component.scss']
})
export class IncomeAddEditComponent implements OnInit, OnDestroy {

  public editEvent;

  incomeId;
  addressId;
  incomeCategoryId;
  fundPartyId;
  amount;
  // fundWayId;
  fundChannelId;
  fundAccountId;
  startDate;
  endDate;
  memo;

  participantList = [];
  labelList = [];
  public addFlag = true;

  public editOrDelFlag = false;

  constructor(
    public accountService: AccountService,
    public incomeService: IncomeService,
    public systemService: SystemService,
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

  async add() {
    this.incomeService.income = {
      userId: this.systemService.user.id,
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
      userId: this.systemService.user.id,
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
    this.startDate = '';
    this.endDate = '';
    this.systemService.reset();
  }

  goAdd() {
    this.addFlag = true;
    this.editOrDelFlag = false;
    this.reset();
  }
}
