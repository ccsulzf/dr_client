import {
  Component, OnInit, Input, OnDestroy, Output, EventEmitter,
  HostListener, ElementRef, Renderer, ViewContainerRef, ViewChild
} from '@angular/core';
import { SystemService, BaseData } from '../../../providers';
import { fromEvent, Subscription } from 'rxjs';
import { map, filter, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import * as _ from 'lodash';
@Component({
  selector: 'fund-party-select',
  templateUrl: './fund-party-select.component.html',
  styleUrls: ['./fund-party-select.component.scss']
})
export class FundPartySelectComponent implements OnInit, OnDestroy {
  @ViewChild('fundPartyListEle') fundPartyListEle: ElementRef;
  @ViewChild('fundPartyInputEle') fundPartyInputEle: ElementRef;
  @Input() title;
  @Input() type;
  @Output() setFundParty = new EventEmitter<string>();

  @Input()
  set fundPartyId(fundPartyId) {
    this.select(_.find(BaseData.fundPartyList, { id: fundPartyId }));
  }

  get fundPartyId(): string { return this.fundParty; }

  list = [];
  // fundPartyList = [];
  fundPartyItem;
  selectedFundPartyItem;
  fundParty;

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
    const searchBox = document.getElementById('fundParty-list');
    const typeahead = fromEvent(searchBox, 'input').pipe(
      map((e: any) => {
        return e.target.value;
      }),
      filter(text => {
        if (text.length >= 1) {
          return text.length >= 1;
        } else {
          this.list = _.filter(BaseData.fundPartyList, { type: this.type });
          this.ulShow = true;
          return false;
        }
      }),
      // debounceTime(10),
      distinctUntilChanged()
    );
    typeahead.subscribe(data => {
      this.list = BaseData.fundPartyList.filter((item) => {
        return item.name.indexOf(data) > -1 || this.system.filterByPY(item, 'name', data);
      });
    });

    this.resetEvent = this.system.resetEvent.subscribe(() => {
      this.init();
    });

    this.doneEvent = this.system.doneEvent.subscribe((value) => {
      if (value && value.model === 'fundParty') {
        this.select(value.data);
        this.list = _.filter(BaseData.fundPartyList, { type: this.type });
      }
    });

    this.changeTabViewEvent = this.system.changeTabViewEvent.subscribe((value) => {
      if (value === this.title) {
        this.ulShow = true;
        this.fundPartyInputEle.nativeElement.focus();
        this.system.selectedTabView = value;
        this.showULFundParty();
      } else {
        this.select(this.fundPartyItem);
        this.fundPartyInputEle.nativeElement.blur();
        this.ulShow = false;
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onClick() {
    if (this.fundPartyListEle.nativeElement.contains(event.target)) {
      this.system.selectedTabView = this.title;
      this.ulShow = true;
    } else {
      if (!_.find(this.list, (item) => {
        return item.name === this.fundParty;
      })) {
        this.fundParty = '';
      }
      this.ulShow = false;
    }
  }

  @HostListener('body:keyup', ['$event'])
  keyUp(e?) {
    if (this.ulShow && e) {
      let index = -1;
      let nextIndex = 0;
      let prevIndex = 0;
      if (this.fundPartyItem) {
        index = _.findIndex(this.list, { id: this.fundPartyItem.id });
        nextIndex = (index === this.list.length - 1) ? 0 : index + 1;
        prevIndex = (index === 0) ? this.list.length - 1 : index - 1;
      } else {
        nextIndex = (index === this.list.length - 1) ? 0 : index + 1;
        prevIndex = this.list.length - 1;
      }

      switch (e.keyCode) {
        case 38: // 上
          this.fundPartyItem = this.list[prevIndex];
          this.fundParty = this.fundPartyItem.name;
          this.showULFundParty();
          break;
        case 40: // 下
          this.fundPartyItem = this.list[nextIndex];
          this.fundParty = this.fundPartyItem.name;
          this.showULFundParty();
          break;
        case 27: // esc
          this.ulShow = false;
          this.select(this.selectedFundPartyItem);
          break;
        default:
          break;
      }
    }
  }

  showULFundParty() {
    if (this.fundPartyItem) {
      const list = document.getElementById('fundParty-ul');
      const targetLi = document.getElementById(this.fundPartyItem.id);
      list.scrollTop = (targetLi.offsetTop - 8);
    }
  }

  init() {
    this.list = _.filter(BaseData.fundPartyList, { type: this.type });
    // this.select(_.first(this.fundPartyList));
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
      this.selectedFundPartyItem = item;
      this.fundPartyItem = item;
      this.fundParty = item.name;
      this.setFundParty.emit(this.fundPartyItem.id);
    } else {
      this.fundPartyItem = null;
      this.fundParty = '';
    }
  }

  add(event?) {
    // 只能用event来判断是enter还是click
    if (event.screenX === 0 && event.screenY === 0) {
      if (this.ulShow) {
        this.select(this.fundPartyItem);
      } else {
        // 不知道为什么不用setTimeOut就不行
        setTimeout(() => {
          this.ulShow = true;
          // this.fundPartyItem = this.list[0] || null;
          // this.fundParty = this.fundPartyItem.name || '';
          if (this.selectedFundPartyItem) {
            this.showULFundParty();
          }
        });
      }
    } else {
      this.select();
      this.system.changeComponent({ component: 'fundParty-add-edit', data: this.type });
    }
  }

}
