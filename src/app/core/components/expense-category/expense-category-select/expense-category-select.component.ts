import {
  Component, OnInit, Input, OnDestroy, Output, EventEmitter,
  HostListener, ElementRef, Renderer, ViewContainerRef
} from '@angular/core';
import { SystemService, BaseData, HttpClientService } from '../../../providers';
import * as _ from 'lodash';

@Component({
  selector: 'expenseCategory-select',
  templateUrl: './expense-category-select.component.html',
  styleUrls: ['./expense-category-select.component.scss']
})
export class ExpenseCategorySelectComponent implements OnInit, OnDestroy {
  @Input() title;
  @Output() setCategory = new EventEmitter<string>();

  @Input()
  set expenseCategoryId(expenseCategoryId) {
    this.select(_.find(BaseData.expenseCategoryList, { id: expenseCategoryId }));
  }

  get expenseCategoryId(): string { return this.expenseCategory; }

  @Input()
  set expenseBook(expenseBook) {
    this.expenseBookId = expenseBook.id;
  }

  get expenseBook() {
    return _.find(BaseData.expenseBookList, { id: this.expenseBookId });
  }

  expenseBookId;

  expenseCategoryList: any;
  expenseCategoryItem;
  expenseCategory;

  resetEvent;
  doneEvent;

  isListShow = false;

  clickId = 'expenseCategory-list';

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
      if (value && value.model === 'expenseCategory') {
        this.select(value.data);
      } else {
        this.expenseCategoryList = _.filter(BaseData.expenseCategoryList, { expenseBookId: this.expenseBookId });
        this.select(_.first(this.expenseCategoryList));
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
    this.expenseCategoryList = _.filter(BaseData.expenseCategoryList, { expenseBookId: this.expenseBookId });
    this.select(_.first(this.expenseCategoryList));
  }

  select(item?) {
    this.expenseCategoryList = _.filter(BaseData.expenseCategoryList, { expenseBookId: this.expenseBookId });
    this.isListShow = false;
    if (item) {
      this.expenseCategoryItem = item;
      this.expenseCategory = item.name;
      this.setCategory.emit(this.expenseCategoryItem.id);
    } else {
      this.expenseCategoryItem = null;
      this.expenseCategory = '';
    }
  }

  add() {
    this.select();
    this.system.changeComponent({ component: 'expenseCategory-add-edit', data: this.expenseBook });
  }
}
