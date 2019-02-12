import {
  Component, OnInit, Input, OnDestroy, Output, EventEmitter,
  HostListener, ElementRef, Renderer, ViewContainerRef, ViewChild
} from '@angular/core';
import { HttpClientService, BaseDataService, SystemService, BaseData } from '../../../providers';

@Component({
  selector: 'app-fund-account-add-edit',
  templateUrl: './fund-account-add-edit.component.html',
  styleUrls: ['./fund-account-add-edit.component.scss']
})
export class FundAccountAddEditComponent implements OnInit {
  @Input() data;

  @ViewChild('divClick') divClick: ElementRef;

  @ViewChild('ulClick') ulClick: ElementRef;
  public isListShow = false;

  public numbers;

  public fundWay;

  public fundAccount = {
    fundWayId: '',
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
    public baseData: BaseDataService,
    private el: ElementRef,
    private viewRef: ViewContainerRef
  ) {
    this.numbers = Array(30).fill(0).map((x, i) => i + 1);
  }

  ngOnInit() {
    this.fundWay = this.baseData.getFundWay(this.data.fundWayId);
    this.fundAccount.fundWayId = this.data.fundWayId;
    this.fundAccount.userId = this.system.user.id;
  }

  @HostListener('document:click', ['$event'])
  onClick() {
    if (this.divClick.nativeElement.contains(event.target)) {
      this.isListShow = !this.isListShow;
    } else {
      if (!this.ulClick.nativeElement.contains(event.target)) {
        this.isListShow = false
      }
    }
  }

  setUsedAmount(data) {
    this.fundAccount.balance = (this.creditAccount.creditAmount * 100 - this.creditAccount.usedAmount * 100) / 100;
    this.creditAccount.usedAmount = data;
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
    const fundcount = await this.http.post('/DR/addFundCount', { fundAccount: this.fundAccount, creditAccount: this.creditAccount });
    if (fundcount) {
      BaseData.fundAccountList.push(fundcount);
      this.system.done({ model: 'fundAccount', data: fundcount });
    }
  }

  cancel() {
    this.system.done();
  }

}
