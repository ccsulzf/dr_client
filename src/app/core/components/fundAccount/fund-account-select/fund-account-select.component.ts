import {
  Component, OnInit, Input, OnDestroy, Output, EventEmitter,
  HostListener, ElementRef, Renderer, ViewContainerRef, ViewChild, forwardRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ValidatorFn, AbstractControl, ValidationErrors, NG_VALIDATORS } from '@angular/forms';

import { SystemService, BaseData } from '../../../providers';
import { fromEvent, Subscription } from 'rxjs';
import { map, filter, distinctUntilChanged, switchMap } from 'rxjs/operators';
import * as _ from 'lodash';

export const FUND_ACCOUNT_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FundAccountSelectComponent),
  multi: true
};
@Component({
  selector: 'fund-account-select',
  templateUrl: './fund-account-select.component.html',
  styleUrls: ['./fund-account-select.component.scss'],
  providers: [FUND_ACCOUNT_ACCESSOR]
})
export class FundAccountSelectComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @ViewChild('fundAccountListEle') fundAccountListEle: ElementRef;
  @ViewChild('fundAccountInputEle') fundAccountInputEle: ElementRef;
  @Input() title;
  @Input() filterCredit;

  @Input()
  set fundChannelId(fundChannelId) {
    if (fundChannelId) {
      this.fundChannel = _.find(BaseData.fundChannelList, { id: fundChannelId });
    } else {
      this.fundChannel = null;
    }
    this.getFundAccountList();
  }
  get fundChannelId(): string { return this.fundChannel.id; }

  list = [];
  fundAccountList = [];

  fundAccountItem;
  fundAccount;

  fundChannel;

  doneEvent;
  updateEvent;

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
    if (value) {
      this.select(_.find(BaseData.fundAccountList, { id: value }));
    } else {
      this.select();
    }
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any) { }

  ngOnInit() {
    this.init();
    const searchBox = document.getElementById('fundAccount-list');
    const typeahead = fromEvent(searchBox, 'input').pipe(
      map((e: any) => {
        return e.target.value;
      }),
      filter(text => {
        if (text.length >= 1) {
          return text.length >= 1;
        } else {
          this.list = _.cloneDeep(this.fundAccountList);
          this.ulShow = true;
          return false;
        }
      }),
      distinctUntilChanged()
    );
    typeahead.subscribe(data => {
      this.list = this.fundAccountList.filter((item) => {
        return item.name.indexOf(data) > -1 || this.system.filterByPY(item, 'name', data);
      });
    });
    this.doneEvent = this.system.doneEvent.subscribe((value) => {
      if (value && value.model === 'fundAccount') {
        this.fundChannel = value.fundChannel;
        this.getFundAccountList();
        if (this.fundChannel && _.find(value.data.fundChannelList, { id: this.fundChannel.id })) {
          this.select(value.data);
        }
      }
    });

    this.updateEvent = this.system.updateEvent.subscribe(() => {
      this.init();
    });

    this.changeTabViewEvent = this.system.changeTabViewEvent.subscribe((value) => {
      if (value === this.title) {
        this.ulShow = true;
        this.fundAccountInputEle.nativeElement.focus();
        this.system.selectedTabView = value;
        this.showULFundAccount();
      } else {
        // this.select(this.fundAccountItem);
        this.fundAccountInputEle.nativeElement.blur();
        this.ulShow = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.doneEvent) {
      this.doneEvent.unsubscribe();
    }
    if (this.changeTabViewEvent) {
      this.changeTabViewEvent.unsubscribe();
    }
    if (this.updateEvent) {
      this.updateEvent.unsubscribe();
    }
  }

  getFundAccountList() {
    this.fundAccountList = [];
    if (this.fundChannel) {
      this.fundAccountList = _.filter(
        BaseData.fundAccountList,
        (item) => {
          if (_.find(item.fundChannelList, { id: this.fundChannel.id })) {
            return true;
          } else {
            return false;
          }
        }) || [];
    }
    if (this.filterCredit && this.fundAccountList.length) {
      this.fundAccountList = _.filter(this.fundAccountList, (item) => {
        return item.isCredit === 0;
      });
    }
    this.list = _.cloneDeep(this.fundAccountList);

    console.info(this.list);
  }

  showULFundAccount() {
    if (this.fundAccountItem) {
      const list = document.getElementById('fundAccount-ul');
      const targetLi = document.getElementById(this.fundAccountItem.id);
      list.scrollTop = (targetLi.offsetTop - 8);
    }
  }

  @HostListener('document:click', ['$event'])
  onClick() {
    if (this.fundAccountListEle.nativeElement.contains(event.target)) {
      // this.getFundAccountList();
      this.ulShow = true;
      // this.list = this.fundAccountList;
      // this.fundAccountItem = this.list[0] || null;
      // this.fundAccount = this.fundAccountItem.name || '';
    } else {
      if (!_.find(this.list, (item) => {
        return item.name === this.fundAccount;
      })) {
        this.fundAccount = '';
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
      if (this.fundAccountItem) {
        index = _.findIndex(this.list, { id: this.fundAccountItem.id });
        nextIndex = (index === this.list.length - 1) ? 0 : index + 1;
        prevIndex = (index === 0) ? this.list.length - 1 : index - 1;
      } else {
        nextIndex = (index === this.list.length - 1) ? 0 : index + 1;
        prevIndex = this.list.length - 1;
      }
      switch (e.keyCode) {
        case 38: // 上
          this.fundAccountItem = this.list[prevIndex];
          this.fundAccount = this.fundAccountItem.name;
          this.propagateChange(this.fundAccountItem.id);
          this.showULFundAccount();
          break;
        case 40: // 下
          this.fundAccountItem = this.list[nextIndex];
          this.fundAccount = this.fundAccountItem.name;
          this.propagateChange(this.fundAccountItem.id);
          this.showULFundAccount();
          break;
        case 13:
          e.stopPropagation();
          this.select(this.fundAccountItem);
          break;
        default:
          break;
      }
    } else if (!this.ulShow && e.keyCode === 13) {
      e.stopPropagation();
      this.ulShow = true;
      this.showULFundAccount();
    }
  }

  init() {
    this.getFundAccountList();
    // this.select();
  }

  change(data) {
    const item = _.find(this.list, { name: data });
    this.select(item);
  }


  select(item?) {
    // this.getFundAccountList();
    if (item) {
      this.fundAccountItem = item;
      this.fundAccount = item.name;
      this.propagateChange(item.id);
      this.ulShow = false;
    } else {
      this.fundAccountItem = null;
      this.fundAccount = '';
      this.propagateChange('');
    }
  }

  add() {
    this.select();
    this.system.changeComponent({
      component: 'fundAccount-add-edit', data: {
        fundChannel: this.fundChannel,
        value: null
      }
    });
  }

  edit(e, item) {
    e.stopPropagation();
    this.ulShow = false;
    this.system.changeComponent({
      component: 'fundAccount-add-edit', data: {
        fundChannel: this.fundChannel,
        value: item
      }
    });
  }
}
