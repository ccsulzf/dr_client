import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { SystemService, BaseData } from '../../../providers';
import * as _ from 'lodash';
@Component({
  selector: 'fund-account-select',
  templateUrl: './fund-account-select.component.html',
  styleUrls: ['./fund-account-select.component.scss']
})
export class FundAccountSelectComponent implements OnInit, OnDestroy {
  @Input() title;
  @Input() fundWayId;
  @Input() filterCredit;
  @Output() setFundAccount = new EventEmitter<string>();

  @Input()
  set fundAccountId(fundAccountId) {
    this.select(_.find(BaseData.fundAccountList, { id: fundAccountId }));
  }

  get fundAccountId(): string { return this.fundAccount; }

  fundAccountList = [];
  fundAccountItem;
  fundAccount;

  showListEvent;
  doneEvent;

  isListShow = true;

  clickId = 'fundAccount-list';

  constructor(
    private system: SystemService
  ) { }

  ngOnInit() {
    this.init();
    this.showListEvent = this.system.showListEvent.subscribe((data) => {
      if (this.clickId === data.id) {
        this.isListShow = !this.isListShow;
      } else {
        if (data.id) {
          this.isListShow = false;
        }
      }
    });
    this.doneEvent = this.system.doneEvent.subscribe((value) => {
      if (value && value.model === 'fundAccount') {
        this.select(value.data);
      } else {
        this.fundAccountList = _.filter(BaseData.fundAccountList, { fundWayId: this.fundWayId });
        if (this.filterCredit) {
          this.fundAccountList = _.filter(this.fundAccountList, { isCredit: 0 })
        }
        this.select(_.first(this.fundAccountList));
      }
    });
  }

  ngOnDestroy() {
    if (this.showListEvent) {
      this.showListEvent.unsubscribe();
    }
    if (this.doneEvent) {
      this.doneEvent.unsubscribe();
    }
  }

  init() {
    this.fundAccountList = _.filter(BaseData.fundAccountList, { fundWayId: this.fundWayId });
    if (this.filterCredit) {
      this.fundAccountList = _.filter(this.fundAccountList, { isCredit: 0 })
    }
    this.select(_.first(this.fundAccountList));
  }

  select(item?) {
    this.fundAccountList = _.filter(BaseData.fundAccountList, { fundWayId: this.fundWayId });
    if (this.filterCredit) {
      this.fundAccountList = _.filter(this.fundAccountList, { isCredit: 0 })
    }
    this.isListShow = false;
    if (item) {
      this.fundAccountItem = item;
      this.fundAccount = item.name;
      this.setFundAccount.emit(this.fundAccountItem.id);
    } else {
      this.fundAccountItem = null;
      this.fundAccount = '';
    }
  }

  add() {
    this.select();
    this.system.changeComponent({ component: 'fundAccount-add-edit', data: { fundWayId: this.fundWayId } });
  }
}
