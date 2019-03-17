import {
  Component, OnInit, Input, OnDestroy, Output, EventEmitter,
  HostListener, ElementRef, Renderer, ViewContainerRef
} from '@angular/core';
import { SystemService, BaseData } from '../../../providers';
import * as _ from 'lodash';
@Component({
  selector: 'incomeCategory-select',
  templateUrl: './incomeCategory-select.component.html',
  styleUrls: ['./incomeCategory-select.component.scss']
})
export class IncomeCategorySelectComponent implements OnInit, OnDestroy {
  @Input() title;
  @Output() setCategory = new EventEmitter<string>();

  incomeCategoryList = [];
  incomeCategoryItem;
  incomeCategory;


  @Input()
  set incomeCategoryId(incomeCategoryId) {
    this.select(_.find(BaseData.incomeCategoryList, { id: incomeCategoryId }));
  }

  get incomeCategoryId(): string { return this.incomeCategory; }

  resetEvent;
  doneEvent;

  isListShow = false;

  constructor(
    public system: SystemService,
    public el: ElementRef,
  ) { }

  ngOnInit() {
    this.init();
    this.resetEvent = this.system.resetEvent.subscribe(() => {
      this.init();
    });

    this.doneEvent = this.system.doneEvent.subscribe((value) => {
      if (value && value.model === 'incomeCategory') {
        this.select(value.data);
      } else {
        this.select(_.first(this.incomeCategoryList));
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

    console.info(this.incomeCategoryList);
    this.select(_.first(this.incomeCategoryList));
  }

  select(item?) {
    this.isListShow = false;
    if (item) {
      this.incomeCategoryItem = item;
      this.incomeCategory = item.name;
      this.setCategory.emit(this.incomeCategoryItem.id);
    } else {
      this.incomeCategoryItem = null;
      this.incomeCategory = '';
    }
  }


  add() {
    this.select();
    this.system.changeComponent({ component: 'incomeCategory-add-edit' });
  }
}
