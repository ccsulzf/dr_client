import { Component, OnInit, Input } from '@angular/core';
import { HttpClientService, BaseDataService, SystemService, BaseData } from '../../../providers';

@Component({
  selector: 'app-fund-account-add-edit',
  templateUrl: './fund-account-add-edit.component.html',
  styleUrls: ['./fund-account-add-edit.component.scss']
})
export class FundAccountAddEditComponent implements OnInit {
  @Input() data;
  public fundWay;

  public fundAccountAmount = 0; // 如果存在信贷数据,那么fundAccountAmount = -usedAmount
  public fundAccount = {
    fundWayId: '',
    name: '',
    amount: this.fundAccountAmount,
    isCredit: false,
    userId: ''
  };

  public creditAccount = {
    creditAmount: 0,
    usedAmount: 0,
    billDay: '',
    repaymentDay: ''
  };

  constructor(
    public system: SystemService,
    public http: HttpClientService,
    public baseData: BaseDataService
  ) { }

  ngOnInit() {
    this.fundWay = this.data;
    this.fundAccount.fundWayId = this.fundWay.id;
    this.fundAccount.userId = this.system.user.id;
  }

  setUsedAmount(data) {
    this.fundAccountAmount = -data;
  }

  setIsCredit(data) {
    console.info(data);
    this.fundAccount.isCredit = data;
    if (!data) {
      this.fundAccountAmount = 0;
      this.creditAccount = {
        creditAmount: 0,
        usedAmount: 0,
        billDay: '',
        repaymentDay: ''
      };
    }
  }

  async add() {
    const fundcount = await this.http.post('/DR/addFundCount', { fundAccount: this.fundAccount, creditAccount: this.creditAccount });
    if (fundcount) {
      BaseData.fundAccountList.push(fundcount);
      this.system.done();
    }
  }

  cancel() {
    this.system.done();
  }

}
