import {
  Component, OnInit, Input, OnDestroy, Output, EventEmitter,
  HostListener, ElementRef, Renderer, ViewContainerRef, ViewChild
} from '@angular/core';
import { SystemService, BaseDataService, BaseData } from '../../../providers';
import * as _ from 'lodash';

import { fromEvent } from 'rxjs';
import { map, filter, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
@Component({
  selector: 'address-select',
  templateUrl: './address-select.component.html',
  styleUrls: ['./address-select.component.scss']
})
export class AddressSelectComponent implements OnInit, OnDestroy {
  @ViewChild('addressListEle') addressListEle: ElementRef;
  @Input() title;
  @Output() setAddress = new EventEmitter<string>();

  @Input()
  set addressId(addressId) {
    if (addressId) {
      this.select(_.find(BaseData.addressList, { id: addressId }));
    } else {
      this.select(_.find(this.addressList, { isCurrenLive: 1 }));
    }

  }

  get addressId(): string { return this.address; }

  list = [];
  addressList = [];
  addressItem;
  address;

  showListEvent;
  doneEvent;
  resetEvent;

  ulShow = false;

  // isListShow = false;

  // clickId = 'address-select';
  constructor(
    public system: SystemService,
    public el: ElementRef,
    public renderer: Renderer,
    public viewRef: ViewContainerRef
  ) { }

  ngOnInit() {
    this.init();
    const searchBox = document.getElementById('address-list');
    const typeahead = fromEvent(searchBox, 'input').pipe(
      map((e: any) => {
        return e.target.value;
      }),
      filter(text => {
        if (text.length >= 1) {
          return text.length >= 1;
        } else {
          this.list = this.addressList;
          this.ulShow = true;
          return false;
        }
      }),
      debounceTime(10),
      distinctUntilChanged()
    );
    typeahead.subscribe(data => {
      this.list = this.addressList.filter((item) => {
        return (item.province.indexOf(data) > -1 || item.city.indexOf(data) > -1 || item.area.indexOf(data) > -1);
      });
    });
    this.resetEvent = this.system.resetEvent.subscribe(() => {
      this.init();
    });

    this.doneEvent = this.system.doneEvent.subscribe((value) => {
      if (value && value.model === 'address') {
        this.select(value.data);
        this.list.push(value.data);
        this.addressList.push(value.data);
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onClick() {
    if (this.addressListEle.nativeElement.contains(event.target)) {
      this.ulShow = true;
      this.list = this.addressList;
    } else {
      if (!_.find(this.list, (item) => {
        return `${item.province}|${item.city}|${item.area}` === this.address;
      })) {
        this.address = '';
      }
      this.ulShow = false;
    }
  }

  init() {
    this.addressList = BaseData.addressList;
    this.list = this.addressList;
    this.select(_.find(this.addressList, { isCurrenLive: 1 }));
  }

  select(item?) {
    if (item) {
      this.addressItem = item;
      this.address = item.province + '|' + item.city + '|' + item.area;
      this.setAddress.emit(this.addressItem.id);
      this.ulShow = false;
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
