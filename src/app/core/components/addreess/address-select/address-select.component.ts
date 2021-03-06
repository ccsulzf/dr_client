import {
  Component, OnInit, Input, OnDestroy, Output, EventEmitter,
  HostListener, ElementRef, Renderer, ViewContainerRef, ViewChild, forwardRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ValidatorFn, AbstractControl, ValidationErrors, NG_VALIDATORS } from '@angular/forms';
import { SystemService, BaseDataService, BaseData } from '../../../providers';

import * as _ from 'lodash';
import { fromEvent, Subscription } from 'rxjs';
import { map, filter, distinctUntilChanged } from 'rxjs/operators';

export const ADDRESS_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AddressSelectComponent),
  multi: true
};
@Component({
  selector: 'address-select',
  templateUrl: './address-select.component.html',
  styleUrls: ['./address-select.component.scss'],
  providers: [ADDRESS_ACCESSOR]
})

export class AddressSelectComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @ViewChild('addressListEle') addressListEle: ElementRef;
  @ViewChild('addressInputEle') addressInputEle: ElementRef;
  @Input() title;

  list = [];
  addressItem;
  address;

  doneEvent;
  ulShow = false;
  public changeTabViewEvent: Subscription;
  constructor(
    public system: SystemService,
    public el: ElementRef,
    public renderer: Renderer,
    public viewRef: ViewContainerRef
  ) { }

  propagateChange = (temp: any) => { };

  writeValue(value: any) {
    setTimeout(() => {
      if (value) {
        this.select(_.find(BaseData.addressList, { id: value }));
      } else {
        this.select(_.find(BaseData.addressList, { isCurrenLive: 1 }));
      }
    });
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any) { }

  ngOnInit() {
    this.init();
    const searchBox = document.getElementById('address-list');
    const typeahead = fromEvent(searchBox, 'input').pipe(
      map((e: any) => {
        return e.target.value;
      }),
      filter(text => {
        if (text.length >= 1) {
          return true;
        } else {
          this.list = _.cloneDeep(BaseData.addressList);
          this.ulShow = true;
          return false;
        }
      }),
      distinctUntilChanged()
    );
    typeahead.subscribe(data => {
      this.list = BaseData.addressList.filter((item) => {
        return item.name.indexOf(data) > -1 || this.system.filterByPY(item, 'name', data);
      });
    });

    this.doneEvent = this.system.doneEvent.subscribe((value) => {
      if (value && value.model === 'address') {
        if (value.data) {
          this.select(value.data);
          this.list = _.cloneDeep(BaseData.addressList);
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
      this.showULAddress();
    } else {
      if (!_.find(this.list, (item) => {
        return item.name === this.address;
      })) {
        this.address = '';
      }
      this.ulShow = false;
    }
  }

  @HostListener('keyup', ['$event'])
  hotKeyEvent(e) {
    if (this.ulShow) {
      let index = -1;
      let nextIndex = 0;
      let prevIndex = 0;
      if (this.addressItem) {
        index = _.findIndex(this.list, { id: this.addressItem.id });
        nextIndex = (index === this.list.length - 1) ? 0 : index + 1;
        prevIndex = (index === 0) ? this.list.length - 1 : index - 1;
      } else {
        nextIndex = (index === this.list.length - 1) ? 0 : index + 1;
        prevIndex = this.list.length - 1;
      }
      switch (e.keyCode) {
        case 38: // 上
          this.addressItem = this.list[prevIndex];
          this.address = this.addressItem.name;
          this.propagateChange(this.addressItem.id);
          this.showULAddress();
          break;
        case 40: // 下
          this.addressItem = this.list[nextIndex];
          this.address = this.addressItem.name;
          this.propagateChange(this.addressItem.id);
          this.showULAddress();
          break;
        case 13:
          e.stopPropagation();
          this.select(this.addressItem);
          break;
        default:
          break;
      }
    } else if (!this.ulShow && e.keyCode === 13) {
      e.stopPropagation();
      this.ulShow = true;
      this.showULAddress();
    }
  }

  // 滚动条滚到相应的元素位置
  showULAddress() {
    const list = document.getElementById('address-ul');
    const targetLi = document.getElementById('address_' + this.addressItem.id);
    list.scrollTop = (targetLi.offsetTop - 8);
  }

  init() {
    this.list = _.cloneDeep(BaseData.addressList);
    // this.select(_.find(this.list, { isCurrenLive: 1 }));
  }

  change(value) {
    let address = null;
    if (value) {
      address = _.find(this.list, (item) => {
        return item.name.indexOf(value) > -1;
      });
    }
    this.select(address);
  }

  select(item?) {
    if (item) {
      this.addressItem = item;
      this.address = item.name;
      this.propagateChange(item.id);
      this.ulShow = false;
    } else {
      this.addressItem = null;
      this.address = '';
      this.ulShow = false;
      this.propagateChange('');
    }
  }

  add() {
    this.select();
    this.system.changeComponent({ component: 'address-add-edit', data: null });
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
    if (this.doneEvent) {
      this.doneEvent.unsubscribe();
    }
    if (this.changeTabViewEvent) {
      this.changeTabViewEvent.unsubscribe();
    }
  }

}
