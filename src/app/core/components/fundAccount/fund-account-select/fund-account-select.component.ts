import {
  Component, OnInit, Input, OnDestroy, Output, EventEmitter,
  HostListener, ElementRef, Renderer, ViewContainerRef
} from '@angular/core';
import { SystemService, BaseData } from '../../../providers';
import * as _ from 'lodash';
@Component({
  selector: 'fund-account-select',
  templateUrl: './fund-account-select.component.html',
  styleUrls: ['./fund-account-select.component.scss']
})
export class FundAccountSelectComponent implements OnInit, OnDestroy {
  @Input() title;
  @Input() filterCredit;

  @Input()
  set fundChannelId(fundChannelId) {
    if (fundChannelId) {
      this.fundChannel = _.find(BaseData.fundChannelList, { id: fundChannelId });
      this.getFundAccountList();
    }
  }

  get fundChannelId(): string { return this.fundChannel.id; }

  @Output() setFundAccount = new EventEmitter<string>();

  @Input()
  set fundAccountId(fundAccountId) {
    this.select(_.find(BaseData.fundAccountList, { id: fundAccountId }));
  }

  get fundAccountId(): string { return this.fundAccount; }

  fundAccountList = [];
  fundAccountItem;
  fundAccount;

  fundChannel;

  doneEvent;
  resetEvent;

  isListShow = true;

  constructor(
    private system: SystemService,
    private el: ElementRef,
    private renderer: Renderer,
    private viewRef: ViewContainerRef
  ) { }

  ngOnInit() {
    this.init();
    this.doneEvent = this.system.doneEvent.subscribe((value) => {
      if (value && value.model === 'fundAccount') {
        this.fundChannel = value.fundChannel;
        this.getFundAccountList();
        if (this.fundChannel && _.find(value.data.fundChannelList, { id: this.fundChannel.id })) {
          this.select(value.data);
        }
      }
    });
    this.resetEvent = this.system.resetEvent.subscribe(() => {
      this.init();
    });
  }

  ngOnDestroy() {
    if (this.doneEvent) {
      this.doneEvent.unsubscribe();
    }
    if (this.resetEvent) {
      this.resetEvent.unsubscribe();
    }
  }

  getFundAccountList() {
    if (this.fundChannel) {
      this.fundAccountList = _.filter(BaseData.fundAccountList, (item) => {
        if (_.find(item.fundChannelList, { id: this.fundChannel.id })) {
          return true;
        } else {
          return false;
        }
      });
    }
    if (this.filterCredit) {
      this.fundAccountList = _.filter(this.fundAccountList, { isCredit: 0 });
    }

  }

  @HostListener('document:click', ['$event'])
  onClick() {
    if (this.el.nativeElement.contains(event.target)) {
      this.isListShow = !this.isListShow;
    } else {
      this.isListShow = false;
    }
  }

  init() {
    this.getFundAccountList();
    this.select();
  }

  select(item?) {
    this.getFundAccountList();
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
    this.system.changeComponent({ component: 'fundAccount-add-edit', data: this.fundChannel });
  }
}
