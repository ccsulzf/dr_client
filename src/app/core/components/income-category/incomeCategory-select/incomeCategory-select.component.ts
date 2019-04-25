import {
  Component, OnInit, Input, OnDestroy, Output, EventEmitter,
  HostListener, ElementRef, Renderer, ViewContainerRef,
  ViewChild
} from '@angular/core';
import { SystemService, BaseData } from '../../../providers';


import { fromEvent } from 'rxjs';
import { map, filter, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import * as _ from 'lodash';
@Component({
  selector: 'incomeCategory-select',
  templateUrl: './incomeCategory-select.component.html',
  styleUrls: ['./incomeCategory-select.component.scss']
})
export class IncomeCategorySelectComponent implements OnInit, OnDestroy {
  @ViewChild('incomeCategoryListEle') incomeCategoryListEle: ElementRef;
  @Input() title;
  @Output() setCategory = new EventEmitter<string>();

  incomeCategoryList = [];
  incomeCategoryItem;
  incomeCategory;

  list = [];

  @Input()
  set incomeCategoryId(incomeCategoryId) {
    this.select(_.find(BaseData.incomeCategoryList, { id: incomeCategoryId }));
  }

  get incomeCategoryId(): string { return this.incomeCategory; }

  resetEvent;
  doneEvent;

  ulShow = false;

  constructor(
    public system: SystemService,
    public el: ElementRef,
  ) { }

  ngOnInit() {
    this.init();
    const searchBox = document.getElementById('incomeCategory-list');
    const typeahead = fromEvent(searchBox, 'input').pipe(
      map((e: any) => {
        return e.target.value;
      }),
      filter(text => {
        if (text.length >= 1) {
          return text.length >= 1;
        } else {
          this.list = this.incomeCategoryList;
          this.ulShow = true;
          return false;
        }
      }),
      debounceTime(10),
      distinctUntilChanged()
    );
    typeahead.subscribe(data => {
      this.list = this.incomeCategoryList.filter((item) => {
        return item.name.indexOf(data) > -1;
      });
    });
    this.resetEvent = this.system.resetEvent.subscribe(() => {
      this.init();
    });

    this.doneEvent = this.system.doneEvent.subscribe((value) => {
      if (value && value.model === 'incomeCategory') {
        this.select(value.data);
        this.list.push(value.data);
        this.incomeCategoryList.push(value.data)
      }
    });
  }

  // @HostListener('document:click', ['$event'])
  // onClick() {
  //   if (this.el.nativeElement.contains(event.target)) {
  //     this.isListShow = !this.isListShow;
  //   } else {
  //     this.isListShow = false;
  //   }
  // }

  ngOnDestroy() {
    if (this.resetEvent) {
      this.resetEvent.unsubscribe();
    }
    if (this.doneEvent) {
      this.doneEvent.unsubscribe();
    }
  }

  init() {
    this.incomeCategoryList = BaseData.incomeCategoryList;
    this.list = this.incomeCategoryList;
    this.select(_.first(this.incomeCategoryList));
  }

  select(item?) {
    if (item) {
      this.incomeCategoryItem = item;
      this.incomeCategory = item.name;
      this.ulShow = false;
      this.setCategory.emit(this.incomeCategoryItem.id);
    } else {
      this.incomeCategoryItem = null;
      this.incomeCategory = '';
    }
  }

  @HostListener('document:click', ['$event'])
  onClick() {
    if (this.incomeCategoryListEle.nativeElement.contains(event.target)) {
      this.ulShow = true;
      this.list = this.incomeCategoryList;
    } else {
      if (!_.find(this.list, (item) => {
        return item.name === this.incomeCategory;
      })) {
        this.incomeCategory = '';
      }
      this.ulShow = false;
    }
  }


  add() {
    this.system.changeComponent({ component: 'incomeCategory-add-edit' });
  }
}
