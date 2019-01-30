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

  fundPartyList = [];
  fundPartyItem;
  fundParty;

  showListEvent;
  doneEvent;

  isListShow = false;

  clickId = 'fundParty-list';

  constructor(
    private system: SystemService
  ) { }

  ngOnInit() {
    this.fundPartyList = _.filter(BaseData.fundPartyList, { type: this.type });
    this.select(_.first(this.fundPartyList));
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

  ngOnDestroy() {
    if (this.showListEvent) {
      this.showListEvent.unsubscribe();
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
