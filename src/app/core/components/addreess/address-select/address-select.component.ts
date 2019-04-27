import {
  Component, OnInit, Input, OnDestroy, Output, EventEmitter,
  HostListener, ElementRef, Renderer, ViewContainerRef, ViewChild
} from '@angular/core';
import { SystemService, BaseDataService, BaseData } from '../../../providers';
import * as _ from 'lodash';

import { fromEvent, Subscription } from 'rxjs';
import { map, filter, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
@Component({
  selector: 'address-select',
  templateUrl: './address-select.component.html',
  styleUrls: ['./address-select.component.scss']
})
export class AddressSelectComponent implements OnInit, OnDestroy {
  @ViewChild('addressListEle') addressListEle: ElementRef;
  @ViewChild('addressInputEle') addressInputEle: ElementRef;
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

  get addressId(): string { return this.address.id; }

  list = [];
  addressList = [];
  addressItem;
  address;

  showListEvent;
  doneEvent;
  resetEvent;

  ulShow = false;
  public changeTabViewEvent: Subscription;
  constructor(
    public system: SystemService,
    public el: ElementRef,
    public renderer: Renderer,
    public viewRef: ViewContainerRef
  ) { }

  ngOnInit() {
    this.init();
    this.system.tabViewList.add(this.title);
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

    this.doneEvent = this.system.doneEvent.subscribe((value) => {
      if (value && value.model === 'address') {
        this.select(value.data);
        this.list.push(value.data);
        this.addressList.push(value.data);
      }
    });
    this.changeTabViewEvent = this.system.changeTabViewEvent.subscribe((value) => {
      if (value === this.title) {
        this.ulShow = true;
        this.system.selectedTabView = value;
      } else {
        this.addressInputEle.nativeElement.blur();
        this.ulShow = false;
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

  @HostListener('body:keyup', ['$event'])
  keyUp() {
    var list = document.getElementById("address-ul"),
      targetLi = document.getElementById(this.addressItem.id); // id tag of the <li> element

      console.info(list);
    list.scrollTop = (targetLi.offsetTop - 8);
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

    if (this.doneEvent) {
      this.doneEvent.unsubscribe();
    }
    if (this.changeTabViewEvent) {
      this.changeTabViewEvent.unsubscribe();
    }
  }

}
