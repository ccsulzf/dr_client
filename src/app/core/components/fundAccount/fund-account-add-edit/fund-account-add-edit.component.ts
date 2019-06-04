import {
  Component, OnInit, Input, OnDestroy, Output, EventEmitter,
  HostListener, ElementRef, Renderer, ViewContainerRef, ViewChild
} from '@angular/core';
import { HttpClientService, BaseDataService, SystemService, BaseData } from '../../../providers';
import * as _ from 'lodash';
@Component({
  selector: 'app-fund-account-add-edit',
  templateUrl: './fund-account-add-edit.component.html',
  styleUrls: ['../../core-form.scss', './fund-account-add-edit.component.scss']
})
export class FundAccountAddEditComponent implements OnInit {
  @Input() data;
  @ViewChild('divClick') divClick: ElementRef;
  @ViewChild('ulClick') ulClick: ElementRef;

  public fundChannel;

  public fundAccount = {
    id: '',
    name: '',
    balance: 0,
    isCredit: false,
    userId: this.system.user.id
  };

  public creditAccount = {
    id: '',
    fundAccountId: '',
    creditAmount: 0,
    usedAmount: 0,
    billDay: 1,
    repaymentDay: 2,
  };

  public bindFundChannelList = [];

  public baseData;

  public isListShow = false;

  public fundChannelList;

  public fundChannelNames;

  public numbers;

  constructor(
    public system: SystemService,
    public http: HttpClientService,
    public baseDataService: BaseDataService,
    public el: ElementRef,
    public viewRef: ViewContainerRef
  ) {
    this.fundChannelList = _.cloneDeep(BaseData.fundChannelList);
    for (const item of this.fundChannelList) {
      item.selected = false;
    }
    this.numbers = Array(30).fill(0).map((x, i) => i + 1);
  }

  ngOnInit() {
    console.info(this.data);
    this.fundChannel = this.data.fundChannel;

    if (this.data.value) {
      this.fundAccount = this.data.value;
      if (this.fundAccount.isCredit) {
        this.creditAccount = this.data.value.creditAccount;
      }
      this.bindFundChannelList = this.data.value.fundChannelList;
      for (const item of this.fundChannelList) {
        item.selected = _.find(this.bindFundChannelList, (bindFundChannel) => {
          return bindFundChannel.id === item.id;
        }) ? true : false;
      }
      this.fundChannelNames = _.map(this.bindFundChannelList, 'name').join(',');
    }

    console.info(this.fundAccount);
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

  @HostListener('keyup', ['$event'])
  hotKeyEvent(e) {
    e.stopPropagation();
  }

  select(selected, item) {
    item.selected = selected;
    this.fundChannelNames = _.map(_.filter(this.fundChannelList, { selected: true }), 'name').join(',');
  }

  setUsedAmount(data) {
    this.creditAccount.usedAmount = data;
    this.fundAccount.balance = (this.creditAccount.creditAmount * 100 - this.creditAccount.usedAmount * 100) / 100;
  }

  setCreditAmount(data) {
    this.creditAccount.creditAmount = (data * 100) / 100;
    this.fundAccount.balance = (data * 100) / 100;
  }

  setIsCredit(data) {
    this.fundAccount.isCredit = data;
    if (!data) {
      this.creditAccount = Object.assign(this.creditAccount, {
        creditAmount: 0,
        usedAmount: 0,
        billDay: 1,
        repaymentDay: 2
      });
    }
  }

  async addOrEdit() {
    const fundcount = await this.http.post('/DR/addFundCount',
      {
        fundAccount: this.fundAccount,
        creditAccount: this.creditAccount,
        fundChannelList: _.filter(this.fundChannelList, { selected: true })
      });
    if (fundcount) {
      // 如果添加的账户中包含之前的渠道,发送事件,自动选择新增的账户
      BaseData.fundAccountList.push(fundcount);
      this.system.done({ model: 'fundAccount', data: fundcount, fundChannel: this.fundChannel });
    }
  }

  cancel() {
    this.system.done();
  }

}
