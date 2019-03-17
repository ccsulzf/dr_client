import {
  Component, OnInit, Input, OnDestroy, Output, EventEmitter,
  HostListener, ElementRef, Renderer, ViewContainerRef
} from '@angular/core';
import { SystemService, BaseData } from '../../../providers';
import * as _ from 'lodash';

@Component({
  selector: 'fundChannel-select',
  templateUrl: './fund-channel-select.component.html',
  styleUrls: ['./fund-channel-select.component.scss']
})
export class FundChannelSelectComponent implements OnInit, OnDestroy {

  @Input() title;
  @Output() setFundChannel = new EventEmitter<string>();

  @Input()
  set fundChannelId(fundChannelId) {
    this.select(_.find(BaseData.fundChannelList, { id: fundChannelId }));
  }

  get fundChannelId(): string { return this.fundChannel; }

  fundChannelList = [];
  fundChannelItem;
  fundChannel;

  resetEvent;
  doneEvent;

  isListShow = false;

  constructor(
    public system: SystemService,
    public el: ElementRef,
    public renderer: Renderer,
    public viewRef: ViewContainerRef
  ) { }


  ngOnInit() {
    this.init();

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
    this.select();
  }

  @HostListener('document:click', ['$event'])
  onClick() {
    if (this.el.nativeElement.contains(event.target)) {
      this.isListShow = !this.isListShow;
    } else {
      this.isListShow = false;
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
    this.isListShow = false;
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
