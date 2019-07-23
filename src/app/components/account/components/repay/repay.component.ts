import { Component, OnInit } from '@angular/core';
import { BaseData } from '../../../../core/providers';
import * as _ from 'lodash';
@Component({
  selector: 'app-repay',
  templateUrl: './repay.component.html',
  styleUrls: ['./repay.component.scss']
})
export class RepayComponent implements OnInit {
  public creditAccountList = [];
  public selectedAccount;

  public temp = [1,2,3];
  constructor() { }

  ngOnInit() {
    this.creditAccountList = _.filter(BaseData.fundAccountList, (item) => {
      return item.creditAccount;
    });
    this.selectedAccount = _.first(this.creditAccountList);
  }

}
