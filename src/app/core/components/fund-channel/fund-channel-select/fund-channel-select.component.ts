import {
  Component, OnInit, Input, OnDestroy, Output, EventEmitter,
  HostListener, ElementRef, Renderer, ViewContainerRef, ViewChild
} from '@angular/core';
import { SystemService, BaseData } from '../../../providers';
import { fromEvent } from 'rxjs';
import { map, filter, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'fundChannel-select',
  templateUrl: './fund-channel-select.component.html',
  styleUrls: ['./fund-channel-select.component.scss']
})
export class FundChannelSelectComponent implements OnInit, OnDestroy {
  @ViewChild('fundChannelListEle') fundChannelListEle: ElementRef;
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
  fundChannel;

  resetEvent;
  doneEvent;

  ulShow = false;

  constructor(
    public system: SystemService,
    public el: ElementRef,
    public renderer: Renderer,
    public viewRef: ViewContainerRef
  ) { }


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
  }

  init() {
    this.fundChannelList = BaseData.fundChannelList;
    this.list = this.fundChannelList;
    this.select(_.first(this.fundChannelList));
  }

  @HostListener('document:click', ['$event'])
  onClick() {
    if (this.fundChannelListEle.nativeElement.contains(event.target)) {
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
  }

  select(item?) {
    if (item) {
      this.fundChannelItem = item;
      this.fundChannel = item.name;
      this.setFundChannel.emit(this.fundChannelItem.id);
    } else {
      this.fundChannelItem = null;
      this.fundChannel = '';
    }
  }

  add() {
    this.select();
    this.system.changeComponent({ component: 'fundChannel-add-edit' });
  }

}
