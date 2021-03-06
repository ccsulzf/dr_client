import {
  Component, OnInit, Input, OnDestroy, Output, EventEmitter,
  HostListener, ElementRef, Renderer, ViewContainerRef, ViewChild, forwardRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ValidatorFn, AbstractControl, ValidationErrors, NG_VALIDATORS } from '@angular/forms';
import { SystemService, BaseData } from '../../../providers';
import { fromEvent, Subscription } from 'rxjs';
import { map, filter, distinctUntilChanged, switchMap } from 'rxjs/operators';
import * as _ from 'lodash';

export const FUND_CHANNEL_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FundChannelSelectComponent),
  multi: true
};

@Component({
  selector: 'fundChannel-select',
  templateUrl: './fund-channel-select.component.html',
  styleUrls: ['./fund-channel-select.component.scss'],
  providers: [FUND_CHANNEL_ACCESSOR]
})
export class FundChannelSelectComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @ViewChild('fundChannelListEle') fundChannelListEle: ElementRef;
  @ViewChild('fundChannelInputEle') fundChannelInputEle: ElementRef;
  @Input() title;

  list = [];
  fundChannelList = [];

  fundChannelItem;
  fundChannel;

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
    if (value) {
      this.select(_.find(BaseData.fundChannelList, { id: value }));
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
    const searchBox = document.getElementById('fundChannel-list');
    const typeahead = fromEvent(searchBox, 'input').pipe(
      map((e: any) => {
        return e.target.value;
      }),
      filter(text => {
        if (text.length >= 1) {
          return text.length >= 1;
        } else {
          this.list = this.fundChannelList;
          this.ulShow = true;
          return false;
        }
      }),
      distinctUntilChanged()
    );
    typeahead.subscribe(data => {
      this.list = this.fundChannelList.filter((item) => {
        return item.name.indexOf(data) > -1  && this.system.filterByPY(item, 'name', data);
      });
    });

    this.doneEvent = this.system.doneEvent.subscribe((value) => {
      if (value && value.model === 'fundChannel') {
        this.select(value.data);
      }
    });
    this.changeTabViewEvent = this.system.changeTabViewEvent.subscribe((value) => {
      if (value === this.title) {
        this.fundChannelInputEle.nativeElement.focus();
        this.ulShow = true;
        this.system.selectedTabView = value;
        this.showULFundChannel();
      } else {
        // this.select(this.fundChannelItem);
        this.ulShow = false;
        this.fundChannelInputEle.nativeElement.blur();
      }
    });
  }

  @HostListener('keyup', ['$event'])
  hotKeyEvent(e) {
    if (this.ulShow) {
      let index = -1;
      let nextIndex = 0;
      let prevIndex = 0;
      if (this.fundChannelItem) {
        index = _.findIndex(this.list, { id: this.fundChannelItem.id });
        nextIndex = (index === this.list.length - 1) ? 0 : index + 1;
        prevIndex = (index === 0) ? this.list.length - 1 : index - 1;
      } else {
        nextIndex = (index === this.list.length - 1) ? 0 : index + 1;
        prevIndex = this.list.length - 1;
      }
      switch (e.keyCode) {
        case 38: // 上
          this.fundChannelItem = this.list[prevIndex];
          this.fundChannel = this.fundChannelItem.name;
          this.propagateChange(this.fundChannelItem.id);
          this.showULFundChannel();
          break;
        case 40: // 下
          this.fundChannelItem = this.list[nextIndex];
          this.fundChannel = this.fundChannelItem.name;
          this.propagateChange(this.fundChannelItem.id);
          this.showULFundChannel();
          break;
        case 13:
          e.stopPropagation();
          this.select(this.fundChannelItem);
          break;
        default:
          break;
      }
    } else if (!this.ulShow && e.keyCode === 13) {
      e.stopPropagation();
      this.ulShow = true;
      this.showULFundChannel();
    }
  }

  // 滚动条滚到相应的元素位置
  showULFundChannel() {
    if (this.fundChannelItem) {
      const list = document.getElementById('fundChannel-ul');
      const targetLi = document.getElementById('fundChannel_' + this.fundChannelItem.id);
      list.scrollTop = (targetLi.offsetTop - 8);
    }
  }

  init() {
    this.fundChannelList = BaseData.fundChannelList;
    this.list = this.fundChannelList;
    // this.select(_.first(this.fundChannelList));
  }

  @HostListener('document:click', ['$event'])
  onClick() {
    if (this.fundChannelListEle.nativeElement.contains(event.target)) {
      this.system.selectedTabView = this.title;
      this.ulShow = true;
      this.list = this.fundChannelList;
    } else {
      if (!_.find(this.list, (item) => {
        return item.name === this.fundChannel;
      })) {
        this.fundChannel = '';
      }
      this.ulShow = false;
    }
  }

  ngOnDestroy() {
    if (this.doneEvent) {
      this.doneEvent.unsubscribe();
    }
    if (this.changeTabViewEvent) {
      this.changeTabViewEvent.unsubscribe();
    }
  }

  select(item?) {
    if (item) {
      this.fundChannelItem = item;
      this.fundChannel = item.name;
      this.propagateChange(item.id);
      this.ulShow = false;
    } else {
      this.fundChannelItem = null;
      this.fundChannel = '';
      this.propagateChange('');
    }
  }

  change(data) {
    const item = _.find(this.list, { name: data });
    this.select(item);
  }

  add() {
    this.select();
    this.system.changeComponent({ component: 'fundChannel-add-edit' });
  }

  edit(e, item) {
    e.stopPropagation();
    this.ulShow = false;
    this.system.changeComponent({ component: 'fundChannel-add-edit', data: item });
  }
}
