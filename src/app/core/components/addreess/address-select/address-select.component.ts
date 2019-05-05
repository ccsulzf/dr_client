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
  selectedAddressItem;
  address;

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
          return true;
        } else {
          this.list = _.cloneDeep(this.addressList);
          this.ulShow = true;
          return false;
        }
      }),
      // debounceTime(10),
      distinctUntilChanged()
    );
    typeahead.subscribe(data => {
      this.list = this.addressList.filter((item) => {
        return (item.province.indexOf(data) > -1 || item.city.indexOf(data) > -1 || item.area.indexOf(data) > -1);
      });
    });

    this.doneEvent = this.system.doneEvent.subscribe((value) => {
      if (value && value.model === 'address') {
        if (value.data) {
          this.select(value.data);
          this.list.push(value.data);
          this.addressList.push(value.data);
        } else {
          this.select(this.selectedAddressItem);
        }
      }
    });

    this.changeTabViewEvent = this.system.changeTabViewEvent.subscribe((value) => {
      if (value === this.title) {
        this.addressInputEle.nativeElement.focus();
        this.ulShow = true;
        this.system.selectedTabView = value;
        this.showULAddress();
      } else {
        this.addressInputEle.nativeElement.blur();
        this.ulShow = false;
      }
    });

  }

  @HostListener('document:click', ['$event'])
  onClick() {
    if (this.addressListEle.nativeElement.contains(event.target)) {
      this.system.selectedTabView = this.title;
      this.ulShow = true;
      this.list = this.addressList;
      this.addressItem = this.list[0] || null;
      this.address = this.address.alias_name || '';
      this.showULAddress();
    } else {
      if (!_.find(this.list, (item) => {
        return `${item.province}|${item.city}|${item.area}` === this.address;
      })) {
        this.address = '';
      }
      this.select(this.selectedAddressItem);
    }
  }

  @HostListener('body:keyup', ['$event'])
  keyUp(e?) {
    if (this.ulShow && e) {
      let index = _.findIndex(this.list, { id: this.addressItem.id });
      let nextIndex = (index === this.list.length - 1) ? 0 : index + 1;
      let prevIndex = (index === 0) ? this.list.length - 1 : index - 1;
      switch (e.keyCode) {
        case 38: //上
          this.addressItem = this.list[prevIndex];
          this.address = `${this.addressItem.province}|${this.addressItem.city}|${this.addressItem.area}`;
          this.showULAddress();
          break;
        case 40://下
          this.addressItem = this.list[nextIndex];
          this.address = `${this.addressItem.province}|${this.addressItem.city}|${this.addressItem.area}`;
          this.showULAddress();
          break;
        case 27: //esc
          this.ulShow = false;
          this.select(this.selectedAddressItem);
        default:
          break;
      }
    }
  }

  // 滚动条滚到相应的元素位置
  showULAddress() {
    const list = document.getElementById("address-ul");
    let targetLi = document.getElementById(this.addressItem.id);
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
      this.selectedAddressItem = item;
      this.address = item.province + '|' + item.city + '|' + item.area;
      this.setAddress.emit(this.addressItem.id);
      this.ulShow = false;
    } else {
      this.addressItem = null;
      this.address = '';
    }
  }

  add(event?) {
    // 只能用event来判断是enter还是click
    if (event.screenX === 0 && event.screenY === 0) {
      if (this.ulShow) {
        this.select(this.addressItem);
      } else {
        // 不知道为什么不用setTimeOut就不行
        setTimeout(() => {
          this.ulShow = true;
          this.selectedAddressItem = this.addressItem;
          this.showULAddress();
        });
      }
    } else {
      this.select();
      this.system.changeComponent({ component: 'address-add-edit', data: null });
    }
  }


  edit(e, item) {
    e.stopPropagation();
    this.ulShow = false;
    this.system.changeComponent({ component: 'address-add-edit', data: item });
  }

  delte(e, item) {
    e.stopPropagation();
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
