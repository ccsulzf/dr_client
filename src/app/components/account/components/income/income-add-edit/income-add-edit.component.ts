import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../services/account.service';
@Component({
  selector: 'income-add-edit',
  templateUrl: './income-add-edit.component.html',
  styleUrls: ['./income-add-edit.component.scss']
})
export class IncomeAddEditComponent implements OnInit {

  addressId;
  startDate;
  endDate;

  constructor(
    private accountService: AccountService
  ) { }

  ngOnInit() {
  }

  onSetAddress(addressId) {
  }

  onSetCategory(incomeCategorId) {

  }

  onSetFundParty(fundPartId) {
    console.info(fundPartId);
  }

  onSetParticipantList(participantList) {
  }

  onSetLabelList(labelList) {
  }


}
