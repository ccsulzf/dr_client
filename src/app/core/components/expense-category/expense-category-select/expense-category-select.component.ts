import {
  Component, OnInit, Input, OnDestroy, Output, EventEmitter,
  HostListener, ElementRef, Renderer, ViewContainerRef, ViewChild, forwardRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ValidatorFn, AbstractControl, ValidationErrors, NG_VALIDATORS } from '@angular/forms';
import { fromEvent, Subscription } from 'rxjs';

import { map, filter, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { SystemService, BaseData, HttpClientService } from '../../../providers';

import * as _ from 'lodash';

export const EXPENSE_CATEGORY_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ExpenseCategorySelectComponent),
  multi: true
};

@Component({
  selector: 'expenseCategory-select',
  templateUrl: './expense-category-select.component.html',
  styleUrls: ['./expense-category-select.component.scss'],
  providers: [EXPENSE_CATEGORY_ACCESSOR]
})

export class ExpenseCategorySelectComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @ViewChild('expenseCategoryListEle') expenseCategoryListEle: ElementRef;
  @ViewChild('expenseCategoryInputEle') expenseCategoryInputEle: ElementRef;
  @Input() title;

  @Input()
  set expenseBook(expenseBook) {
    if (expenseBook) {
      this.expenseBookId = expenseBook.id;
      this.init();
    }
  }

  get expenseBook() {
    return _.find(BaseData.expenseBookList, { id: this.expenseBookId });
  }

  expenseBookId;

  expenseCategoryItem;
  expenseCategory;

  resetEvent;
  doneEvent;

  ulShow = false;

  list = [];

  public changeTabViewEvent: Subscription;
  constructor(
    public el: ElementRef,
    public renderer: Renderer,
    public viewRef: ViewContainerRef,
    public system: SystemService,
  ) { }

  propagateChange = (temp: any) => { };

  writeValue(value: any) {
    if (value) {
      this.selectItem(_.find(BaseData.expenseCategoryList, { id: value }));
    } else {
      this.init();
    }
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any) { }

  ngOnInit() {
    this.init();
    this.system.tabViewList.add(this.title);
    const searchBox = document.getElementById('expenseCategory-list');
    const typeahead = fromEvent(searchBox, 'input').pipe(
      map((e: any) => {
        return e.target.value;
      }),
      filter(text => {
        if (text.length >= 1) {
          return text.length >= 1;
        } else {
          this.list = _.filter(BaseData.expenseCategoryList, { expenseBookId: this.expenseBookId });
          this.ulShow = true;
          return false;
        }
      }),
      distinctUntilChanged()
    );
    typeahead.subscribe(data => {
      this.list = _.filter(BaseData.expenseCategoryList, { expenseBookId: this.expenseBookId }).filter((item) => {
        return item.name.indexOf(data) > -1 || this.system.filterByPY(item, 'name', data);
      });
    });

    this.resetEvent = this.system.resetEvent.subscribe(() => {
      this.init();
    });

    this.doneEvent = this.system.doneEvent.subscribe((value) => {
      if (value && value.model === 'expenseCategory') {
        this.selectItem(value.data);
        this.list = _.filter(BaseData.expenseCategoryList, { expenseBookId: this.expenseBookId });
      }
    });

    this.changeTabViewEvent = this.system.changeTabViewEvent.subscribe((value) => {
      if (value === this.title) {
        this.expenseCategoryInputEle.nativeElement.focus();
        this.ulShow = true;
        this.system.selectedTabView = value;
        this.showULExpenseCategory();
      } else {
        this.expenseCategoryInputEle.nativeElement.blur();
        this.ulShow = false;
      }
    });
  }

  @HostListener('keyup', ['$event'])
  hotKeyEvent(e) {
    if (this.ulShow) {
      const index = _.findIndex(this.list, { id: this.expenseCategoryItem.id });
      const nextIndex = (index === this.list.length - 1) ? 0 : index + 1;
      const prevIndex = (index === 0) ? this.list.length - 1 : index - 1;
      switch (e.keyCode) {
        case 38: // 上
          this.expenseCategoryItem = this.list[prevIndex];
          this.expenseCategory = this.expenseCategoryItem.name;
          this.propagateChange(this.expenseCategoryItem.id);
          this.showULExpenseCategory();
          break;
        case 40: // 下
          this.expenseCategoryItem = this.list[nextIndex];
          this.expenseCategory = this.expenseCategoryItem.name;
          this.propagateChange(this.expenseCategoryItem.id);
          this.showULExpenseCategory();
          break;
        case 13:
          e.stopPropagation();
          this.selectItem(this.expenseCategoryItem);
          break;
        default:
          break;
      }
    } else if (!this.ulShow && e.keyCode === 13) {
      e.stopPropagation();
      this.ulShow = true;
      this.showULExpenseCategory();
    }

  }

  // 滚动条滚到相应的元素位置
  showULExpenseCategory() {
    const list = document.getElementById('expenseCategory-ul');
    const targetLi = document.getElementById(this.expenseCategoryItem.id);
    list.scrollTop = (targetLi.offsetTop - 8);
  }

  init() {
    this.list = _.filter(BaseData.expenseCategoryList, { expenseBookId: this.expenseBookId });
    this.selectItem(_.first(this.list));
  }

  selectItem(item?) {
    if (item) {
      this.expenseCategoryItem = item;
      this.expenseCategory = item.name;
      this.propagateChange(item.id);
      this.ulShow = false;
      // this.setCategory.emit(this.expenseCategoryItem.id);
    } else {
      this.expenseCategoryItem = null;
      this.expenseCategory = '';
      this.propagateChange('');
    }
  }

  @HostListener('document:click', ['$event'])
  onClick() {
    if (this.expenseCategoryListEle.nativeElement.contains(event.target)) {
      this.system.selectedTabView = this.title;
      this.ulShow = true;
    } else {
      if (!_.find(this.list, (item) => {
        return item.name === this.expenseCategory;
      })) {
        this.expenseCategory = '';
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

  change(data) {
    const item = _.find(this.list, { name: data });
    this.selectItem(item);
  }

  add() {
    this.selectItem();
    this.system.changeComponent({
      component: 'expenseCategory-add-edit', data: {
        expenseBook: this.expenseBook,
        value: null
      }
    });
  }

  edit(e, item) {
    e.stopPropagation();
    this.ulShow = false;
    this.system.changeComponent({
      component: 'expenseCategory-add-edit', data: {
        expenseBook: this.expenseBook,
        value: item
      }
    });
  }
}

