import {
  Component, OnInit, Input, OnDestroy, Output, EventEmitter,
  HostListener, ElementRef, Renderer, ViewContainerRef
} from '@angular/core';
import { SystemService, BaseData } from '../../../providers';
import * as _ from 'lodash';
@Component({
  selector: 'fund-party-select',
  templateUrl: './fund-party-select.component.html',
  styleUrls: ['./fund-party-select.component.scss']
})
export class FundPartySelectComponent implements OnInit, OnDestroy {

  @Input() title;
  @Input() type;
  @Output() setFundParty = new EventEmitter<string>();

  @Input()
  set fundPartyId(fundPartyId) {
    this.select(_.find(BaseData.fundPartyList, { id: fundPartyId }));
  }

  get fundPartyId(): string { return this.fundParty; }

  fundPartyList = [];
  fundPartyItem;
  fundParty;

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
    this.resetEvent = this.system.resetEvent.subscribe(() => {
      this.init();
    });

    this.doneEvent = this.system.doneEvent.subscribe((value) => {
      if (value && value.model === 'fundParty') {
        this.select(value.data);
      } else {
        this.fundPartyList = _.filter(BaseData.fundPartyList, { type: this.type });
        // this.select(_.first(this.fundPartyList));
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onClick() {
    if (this.el.nativeElement.contains(event.target)) {
      this.isListShow = !this.isListShow;
    } else {
      this.isListShow = false;
    }
  }

  init() {
    this.fundPartyList = _.filter(BaseData.fundPartyList, { type: this.type });
    this.select();
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
    this.fundPartyList = _.filter(BaseData.fundPartyList, { type: this.type });
    this.isListShow = false;
    if (item) {
      this.fundPartyItem = item;
      this.fundParty = item.name;
      this.setFundParty.emit(this.fundPartyItem.id);
    } else {
      this.fundPartyItem = null;
      this.fundParty = '';
    }
  }


  add() {
    this.select();
    this.system.changeComponent({ component: 'fundParty-add-edit', data: this.type });
  }
}
