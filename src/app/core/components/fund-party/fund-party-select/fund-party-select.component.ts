import {
  Component, OnInit, Input, OnDestroy, Output, EventEmitter,
  HostListener, ElementRef, Renderer, ViewContainerRef, ViewChild
} from '@angular/core';
import { SystemService, BaseData } from '../../../providers';
import { fromEvent } from 'rxjs';
import { map, filter, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import * as _ from 'lodash';
@Component({
  selector: 'fund-party-select',
  templateUrl: './fund-party-select.component.html',
  styleUrls: ['./fund-party-select.component.scss']
})
export class FundPartySelectComponent implements OnInit, OnDestroy {
  @ViewChild('fundPartyListEle') fundPartyListEle: ElementRef;
  @Input() title;
  @Input() type;
  @Output() setFundParty = new EventEmitter<string>();

  @Input()
  set fundPartyId(fundPartyId) {
    this.select(_.find(BaseData.fundPartyList, { id: fundPartyId }));
  }

  get fundPartyId(): string { return this.fundParty; }

  list = [];
  fundPartyList = [];
  fundPartyItem;
  fundParty;

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
    const searchBox = document.getElementById('fundParty-list');
    const typeahead = fromEvent(searchBox, 'input').pipe(
      map((e: any) => {
        return e.target.value;
      }),
      filter(text => {
        if (text.length >= 1) {
          return text.length >= 1;
        } else {
          this.list = this.fundPartyList;
          this.ulShow = true;
          return false;
        }
      }),
      debounceTime(10),
      distinctUntilChanged()
    );
    typeahead.subscribe(data => {
      this.list = this.fundPartyList.filter((item) => {
        return item.name.indexOf(data) > -1;
      });
    });

    this.resetEvent = this.system.resetEvent.subscribe(() => {
      this.init();
    });

    this.doneEvent = this.system.doneEvent.subscribe((value) => {
      if (value && value.model === 'fundParty') {
        this.select(value.data);
        this.list.push(value.data);
        this.fundPartyList.push(value.data);
      }
    });

  }

  @HostListener('document:click', ['$event'])
  onClick() {
    if (this.fundPartyListEle.nativeElement.contains(event.target)) {
      this.ulShow = true;
      this.list = this.fundPartyList;
    } else {
      if (!_.find(this.list, (item) => {
        return item.name === this.fundParty;
      })) {
        this.fundParty = '';
      }
      this.ulShow = false;
    }
  }

  init() {
    this.fundPartyList = _.filter(BaseData.fundPartyList, { type: this.type });
    this.list = this.fundPartyList;
    // this.select(_.first(this.fundPartyList));
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
