import {
  Component, OnInit, Input, OnDestroy, Output, EventEmitter,
  HostListener, ElementRef, Renderer, ViewContainerRef, ViewChild
} from '@angular/core';
import { HttpClientService, BaseDataService, SystemService, BaseData } from '../../../providers';
import * as _ from 'lodash';
@Component({
  selector: 'app-fund-account-add-edit',
  templateUrl: './fund-account-add-edit.component.html',
  styleUrls: ['./fund-account-add-edit.component.scss']
})
export class FundAccountAddEditComponent implements OnInit {
  @Input() data;
  @ViewChild('divClick') divClick: ElementRef;

  @ViewChild('ulClick') ulClick: ElementRef;

  public baseData;

  public isListShow = false;

  public fundChannelList;

  public fundChannelName;

  public numbers;

  public fundAccount = {
    name: '',
    balance: 0,
    // 有信贷用户balance等于 abs(creditAmount) - abs(usedAmount)
    isCredit: false,
    userId: ''
  };

  public creditAccount = {
    creditAmount: 0,
    usedAmount: 0,
    billDay: 1,
    repaymentDay: 2,
  };

  constructor(
    public system: SystemService,
    public http: HttpClientService,
    public baseDataService: BaseDataService,
    private el: ElementRef,
    private viewRef: ViewContainerRef
  ) {
    this.fundChannelList = BaseData.fundChannelList;
    for (const item of this.fundChannelList) {
      item.selected = false;
    }
    this.numbers = Array(30).fill(0).map((x, i) => i + 1);
  }

  ngOnInit() {
    this.fundAccount.userId = this.system.user.id;
  }

  @HostListener('document:click', ['$event'])
  onClick() {
    if (this.divClick.nativeElement.contains(event.target)) {
      this.isListShow = !this.isListShow;
    } else {
      if (!this.ulClick.nativeElement.contains(event.target)) {
        this.isListShow = false;
      }
    }
  }

  select(selected, item) {
    item.selected = selected;
    this.fundChannelName = _.map(_.filter(this.fundChannelList, { selected: true }), 'name').join(',');
  }

  setUsedAmount(data) {
    this.creditAccount.usedAmount = data;
    this.fundAccount.balance = (this.creditAccount.creditAmount * 100 - this.creditAccount.usedAmount * 100) / 100;
  }

  setIsCredit(data) {
    this.fundAccount.isCredit = data;
    if (!data) {
      this.creditAccount = {
        creditAmount: 0,
        usedAmount: 0,
        billDay: 1,
        repaymentDay: 2
      };
    }
  }

  async add() {
    const fundcount = await this.http.post('/DR/addFundCount',
      {
        fundAccount: this.fundAccount,
        creditAccount: this.creditAccount,
        fundChannelList: _.filter(this.fundChannelList, { selected: true })
      });
    if (fundcount) {
      // 如果添加的账户中包含之前的渠道,发送事件,自动选择新增的账户
      BaseData.fundAccountList.push(fundcount);
      this.system.done({ model: 'fundAccount', data: fundcount, fundChannel: this.data });
    }
  }

  cancel() {
    this.system.done();
  }

}
