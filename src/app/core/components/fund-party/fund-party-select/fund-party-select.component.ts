import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { SystemService, BaseData } from '../../../providers';
import * as _ from 'lodash';
@Component({
  selector: 'fund-party-select',
  templateUrl: './fund-party-select.component.html',
  styleUrls: ['./fund-party-select.component.scss']
})
export class FundPartySelectComponent implements OnInit, OnDestroy {

  @Input() title;
  @Input() type;
  @Output() setFundParty = new EventEmitter<string>();

  @Input()
  set fundPartyId(fundPartyId) {
    this.select(_.find(BaseData.fundPartyList, { id: fundPartyId }));
  }

  get fundPartyId(): string { return this.fundParty; }

  fundPartyList = [];
  fundPartyItem;
  fundParty;

  resetEvent;
  showListEvent;
  doneEvent;

  isListShow = false;

  clickId = 'fundParty-list';

  constructor(
    private system: SystemService
  ) { }

  ngOnInit() {
    this.resetEvent = this.system.resetEvent.subscribe(() => {
      this.init();
    });

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
      if (value && value.model === 'fundParty') {
        this.select(value.data);
      } else {
        this.fundPartyList = _.filter(BaseData.fundPartyList, { type: this.type });
        this.select(_.first(this.fundPartyList));
      }
    });
  }

  init() {
    this.fundPartyList = _.filter(BaseData.fundPartyList, { type: this.type });
    this.select(_.first(this.fundPartyList));
  }

  ngOnDestroy() {
    if (this.resetEvent) {
      this.resetEvent.unsubscribe();
    }
    if (this.showListEvent) {
      this.showListEvent.unsubscribe();
    }
    if (this.doneEvent) {
      this.doneEvent.unsubscribe();
    }
  }

  select(item?) {
    this.fundPartyList = _.filter(BaseData.fundPartyList, { type: this.type });
    this.isListShow = false;
    if (item) {
      console.info(item);
      this.fundPartyItem = item;
      this.fundParty = item.name;
      this.setFundParty.emit(this.fundPartyItem.id);
    } else {
      this.fundPartyItem = null;
      this.fundParty = '';
    }
  }


  add() {
    this.select();
    this.system.changeComponent({ component: 'fundParty-add-edit', data: this.type });
  }
}
