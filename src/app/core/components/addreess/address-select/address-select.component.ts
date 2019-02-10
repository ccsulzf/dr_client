import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { SystemService, BaseDataService, BaseData } from '../../../providers';
import * as _ from 'lodash';
@Component({
  selector: 'address-select',
  templateUrl: './address-select.component.html',
  styleUrls: ['./address-select.component.scss']
})
export class AddressSelectComponent implements OnInit, OnDestroy {
  @Input() title;
  @Output() setAddress = new EventEmitter<string>();

  @Input()
  set addressId(addressId) {
    this.select(_.find(BaseData.addressList, { id: addressId }));
  }

  get addressId(): string { return this.address; }

  addressList = [];
  addressItem;
  address;

  showListEvent;
  doneEvent;
  resetEvent;

  isListShow = false;

  clickId = 'address-select';
  constructor(
    private system: SystemService
  ) { }

  ngOnInit() {
    this.init();

    this.resetEvent = this.system.resetEvent.subscribe(() => {
      this.init();
    })

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
      if (value && value.model === 'address') {
        this.select(value.data);
      } else {
        this.select(_.find(this.addressList, { isCurrenLive: 1 }));
      }
    });
  }

  init() {
    this.addressList = BaseData.addressList;
    this.select(_.find(this.addressList, { isCurrenLive: 1 }));
  }

  select(item?) {
    this.isListShow = false;
    if (item) {
      this.addressItem = item;
      this.address = item.province + '|' + item.city + '|' + item.area;
      this.setAddress.emit(this.addressItem.id);
    } else {
      this.addressItem = null;
      this.address = '';
    }
  }

  add() {
    this.select();
    this.system.changeComponent({ component: 'address-add-edit' });
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

}
