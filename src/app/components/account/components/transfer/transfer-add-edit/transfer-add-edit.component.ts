import { Component, OnInit, OnDestroy, AfterViewInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { AccountService } from '../../../services';
import { BaseDataService, SystemService, NotifyService, HttpClientService } from '../../../../../core/providers';
import { BaseData } from '../../../../../core/providers/base-data';
import { Transfer } from '../../../models';
import { TransferService } from '../../../services';

import { Subscription } from 'rxjs';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'transfer-add-edit',
  templateUrl: './transfer-add-edit.component.html',
  styleUrls: ['./transfer-add-edit.component.scss']
})
export class TransferAddEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('amountInputEle') amountInputEle: ElementRef;
  @ViewChild('isHadleInputEle') isHadleInputEle: ElementRef;
  transfer: Transfer = {
    id: '',
    userId: this.system.user.id,
    transferDate: moment().format('YYYY-MM-DD'),
    outFundAccountId: '',
    inFundAccountId: '',
    isHandle: false,
    handleFee: 0,
    amount: '',
    memo: ''
  };

  labelList = [];

  public editEvent;

  public addFlag = true;
  public editOrDelFlag = false;

  public changeTabViewEvent: Subscription;

  constructor(
    public accountService: AccountService,
    public transferService: TransferService,
    public system: SystemService,
    public http: HttpClientService,
    public notifyService: NotifyService,
    private fb: FormBuilder,
    public baseDataService: BaseDataService
  ) { }

  transferForm = this.fb.group({
    outFundAccount: [this.transfer.outFundAccountId, Validators.required],
    inFundAccount: [this.transfer.inFundAccountId, Validators.required],
    transferDate: [this.transfer.transferDate],
    isHandle: [this.transfer.isHandle],
    handleFee: [this.transfer.handleFee],
    amount: [this.transfer.amount, Validators.required],
    memo: [this.transfer.memo]
  });

  ngOnInit() {
    this.system.tabViewList = new Map([
      ['outFundAccount', '转出账户'],
      ['inFundAccount', '转入账户'],
      ['transferDate', '转账日期'],
      ['isHandle', '是否手续费'],
      ['handleFee', '手续费'],
      ['amout', '转账金额'],
      ['fundAccount', '存入账户'],
      ['label', '标签'],
      ['memo', '备注']
    ]);
  }

  ngAfterViewInit() {
    this.reset();
    // this.editEvent = this.incomeService.editEvent.subscribe(async (data: any) => {
    //   this.income = data;
    //   await this.getLableList();
    //   await this.getParticipantList();
    //   this.addFlag = false;
    //   this.editOrDelFlag = true;
    // });

    this.changeTabViewEvent = this.system.changeTabViewEvent.subscribe((value) => {
      if (value === '转账金额') {
        this.system.selectedTabView = value;
        this.amountInputEle.nativeElement.focus();
      } else if (value === '是否手续费') {
        this.system.selectedTabView = value;
        this.isHadleInputEle.nativeElement.focus();
      } else {
        this.amountInputEle.nativeElement.blur();
      }
    });
  }

  ngOnDestroy() {
    if (this.editEvent) {
      this.editEvent.unsubscribe();
    }

    if (this.changeTabViewEvent) {
      this.changeTabViewEvent.unsubscribe();
    }
  }

  async getLableList() {
    this.labelList = [];
    const data: any = await this.http.get('/DR/TransferLabel?incomeId=' + this.transfer.id);
    if (data && data.length) {
      for (const item of data) {
        this.labelList.push(this.baseDataService.getLabel(item.labelId));
      }
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

  @HostListener('body:keyup', ['$event'])
  hotKeyEvent(e) {
    switch (e.keyCode) {
      case 9:
        this.tabCustomInput(e);
        break;
      // enter
      case 13:
        if (this.addFlag) {
          this.addTransfer();
        }
        if (this.editOrDelFlag) {
          this.editTransfer();
        }
        break;
      // delete
      case 46:
        if (this.editOrDelFlag) {
          this.delTransfer();
        }
        break;
      default:
        break;
    }
  }

  tabCustomInput(e?) {
    const values = Array.from(this.system.tabViewList.values());
    if (this.system.selectedTabView && e) {
      const index = _.findIndex(values, (item) => {
        return item === this.system.selectedTabView;
      });
      if ((index > -1) && (index <= values.length - 1)) {
        this.system.changeTabView((e.shiftKey ? values[index - 1] : values[index + 1]) || values[0]);
      }
    } else {
      const object = Object.assign(this.transferForm.value);
      for (const property in object) {
        if (!this.transferForm.value[property]) {
          const tabView = this.system.tabViewList.get(property);
          this.system.changeTabView(tabView);
          break;
        }
      }
    }
  }
  onSetLabelList(labelList) {
    this.labelList = labelList;
  }

  setFundAccount(data) {
    if (data.title && data.value) {
      if (data.title === '转出账户') {
        this.transfer.outFundAccountId = data.value;
      }
      if (data.title === '转入账户') {
        this.transfer.inFundAccountId = data.value;
      }
    }
  }

  reset() {
    this.transferForm.patchValue({
      outFundAccount: '',
      inFundAccount: '',
      transferDate: moment().format('YYYY-MM-DD'),
      isHandle: false,
      handleFee: '',
      amount: '',
      memo: ''
    });
    this.system.selectedTabView = null;
    this.labelList = [];
    this.transferForm.markAsPristine();
  }

  async addTransfer() {
    try {
      if (!this.transferForm.valid) {
        for (const item in this.transferForm.controls) {
          this.transferForm.get(item).markAsTouched();
        }
        return;
      }
      await this.transferService.add(this.transfer, this.labelList);
      this.notifyService.notify('转账成功', 'success');
      this.reset();
    } catch (error) {
      this.notifyService.notify('转账失败', 'error');
    }
  }

  async editTransfer() {

  }

  async delTransfer() {

  }



}
