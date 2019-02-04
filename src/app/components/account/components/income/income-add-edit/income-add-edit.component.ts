import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { IncomeService } from '../../../services/income.service'
import { SystemService } from '../../../../../core/providers';
import * as moment from 'moment';
import * as _ from 'lodash';
@Component({
  selector: 'income-add-edit',
  templateUrl: './income-add-edit.component.html',
  styleUrls: ['./income-add-edit.component.scss']
})
export class IncomeAddEditComponent implements OnInit {

  addressId;
  incomeCategoryId;
  fundPartyId;
  amount;
  fundWayId;
  fundAccountId;
  startDate;
  endDate = moment().format('YYYY-MM-DD');
  memo;

  participantList = [];
  labelList = [];
  public addFlag = true;

  public editOrDelFlag = false;

  constructor(
    private accountService: AccountService,
    private incomeService: IncomeService,
    private systemService: SystemService
  ) { }

  ngOnInit() {
  }

  onSetAddress(addressId) {
    this.addressId = addressId;
  }

  onSetCategory(incomeCategorId) {
    this.incomeCategoryId = incomeCategorId;
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

  onSetFundWay(fundWayId) {
    this.fundWayId = fundWayId;
  }

  onSetFundAccount(fundAccountId) {
    this.fundAccountId = fundAccountId;
  }

  async add() {
    this.incomeService.income = {
      userId: this.systemService.user.id,
      addressId: this.addressId,
      incomeCategorId: this.incomeCategoryId,
      fundPartyId: this.fundPartyId,
      amount: this.amount,
      fundWayId: this.fundWayId,
      fundAccountId: this.fundAccountId,
      startDate: this.startDate,
      endDate: this.endDate,
      memo: this.memo,
    }

    await this.incomeService.add(this.participantList, this.labelList);
  }

}
