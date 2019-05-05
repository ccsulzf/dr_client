import {
  Component, OnInit, Input, OnDestroy, Output, EventEmitter,
  HostListener, ElementRef, Renderer, ViewContainerRef, ViewChild
} from '@angular/core';
import { SystemService, BaseData } from '../../../providers';
import { fromEvent, Subscription } from 'rxjs';
import { map, filter, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'fundChannel-select',
  templateUrl: './fund-channel-select.component.html',
  styleUrls: ['./fund-channel-select.component.scss']
})
export class FundChannelSelectComponent implements OnInit, OnDestroy {
  @ViewChild('fundChannelListEle') fundChannelListEle: ElementRef;
  @ViewChild('fundChannelInputEle') fundChannelInputEle: ElementRef;
  @Input() title;
  @Output() setFundChannel = new EventEmitter<string>();

  @Input()
  set fundChannelId(fundChannelId) {
    this.select(_.find(BaseData.fundChannelList, { id: fundChannelId }));
  }

  get fundChannelId(): string { return this.fundChannel; }

  list = [];
  fundChannelList = [];
  fundChannelItem;
  selectedFundChannelItem;
  fundChannel;

  resetEvent;
  doneEvent;

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
      debounceTime(10),
      distinctUntilChanged()
    );
    typeahead.subscribe(data => {
      this.list = this.fundChannelList.filter((item) => {
        return item.name.indexOf(data) > -1;
      });
    });


    this.resetEvent = this.system.resetEvent.subscribe(() => {
      this.init();
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
        this.fundChannelInputEle.nativeElement.blur();
        this.ulShow = false;
      }
    });
  }

  @HostListener('body:keyup', ['$event'])
  keyUp(e?) {
    if (this.ulShow && e) {
      let index = _.findIndex(this.list, { id: this.fundChannelItem.id });
      let nextIndex = (index === this.list.length - 1) ? 0 : index + 1;
      let prevIndex = (index === 0) ? this.list.length - 1 : index - 1;
      switch (e.keyCode) {
        case 38: //上
          this.fundChannelItem = this.list[prevIndex];
          this.fundChannel = this.fundChannelItem.name;
          this.showULFundChannel();
          break;
        case 40://下
          this.fundChannelItem = this.list[nextIndex];
          this.fundChannel = this.fundChannelItem.name;
          this.showULFundChannel();
          break;
        case 27: //esc
          this.ulShow = false;
          this.select(this.selectedFundChannelItem);
        default:
          break;
      }
    }
  }

  // 滚动条滚到相应的元素位置
  showULFundChannel() {
    const list = document.getElementById("fundChannel-ul");
    let targetLi = document.getElementById(this.fundChannelItem.id);
    list.scrollTop = (targetLi.offsetTop - 8);
  }

  init() {
    this.fundChannelList = BaseData.fundChannelList;
    this.list = this.fundChannelList;
    this.select(_.first(this.fundChannelList));
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

  select(item?) {
    if (item) {
      this.selectedFundChannelItem = this.fundChannelItem;
      this.fundChannelItem = item;
      this.fundChannel = item.name;
      this.setFundChannel.emit(this.fundChannelItem.id);
    } else {
      this.fundChannelItem = null;
      this.fundChannel = '';
    }
  }


  add(event?) {
    // 只能用event来判断是enter还是click
    if (event.screenX === 0 && event.screenY === 0) {
      if (this.ulShow) {
        this.select(this.fundChannelItem);
      } else {
        // 不知道为什么不用setTimeOut就不行
        setTimeout(()=>{
          this.ulShow = true;
          this.selectedFundChannelItem = this.fundChannelItem;
          this.showULFundChannel();
        });
      }
    } else {
      this.select();
      this.system.changeComponent({ component: 'fundChannel-add-edit' });
    }
  }
}
