import {
  Component, OnInit, Input, OnDestroy, Output, EventEmitter,
  HostListener, ElementRef, Renderer, ViewContainerRef, ViewChild
} from '@angular/core';
import { SystemService, BaseData } from '../../../providers';
import { fromEvent } from 'rxjs';
import { map, filter, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import * as _ from 'lodash';
@Component({
  selector: 'fund-account-select',
  templateUrl: './fund-account-select.component.html',
  styleUrls: ['./fund-account-select.component.scss']
})
export class FundAccountSelectComponent implements OnInit, OnDestroy {
  @ViewChild('fundAccountListEle') fundAccountListEle: ElementRef;
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

  get fundAccountId(): string { return this.fundAccount.id; }

  list = [];
  fundAccountList = [];
  fundAccountItem;
  fundAccount;

  fundChannel;

  doneEvent;
  resetEvent;

  ulShow = false;

  // isListShow = true;

  constructor(
    public system: SystemService,
    public el: ElementRef,
    public renderer: Renderer,
    public viewRef: ViewContainerRef
  ) { }

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
          this.list = this.fundAccountList;
          this.ulShow = true;
          return false;
        }
      }),
      debounceTime(10),
      distinctUntilChanged()
    );
    typeahead.subscribe(data => {
      this.list = this.fundAccountList.filter((item) => {
        return item.name.indexOf(data) > -1;
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
        return item.isCredit == 0;
      });
    }
    this.list = this.fundAccountList;
  }

  @HostListener('document:click', ['$event'])
  onClick() {
    if (this.fundAccountListEle.nativeElement.contains(event.target)) {
      this.ulShow = true;
      this.list = this.fundAccountList;
    } else {
      if (!_.find(this.list, (item) => {
        return item.name === this.fundAccount;
      })) {
        this.fundAccount = '';
      }
      this.ulShow = false;
    }
  }

  init() {
    this.getFundAccountList();
    this.select();
  }

  select(item?) {
    this.getFundAccountList();
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
