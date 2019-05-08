// import {
//   Component, OnInit, Input, OnDestroy, Output, EventEmitter,
//   HostListener, ElementRef, Renderer, ViewContainerRef
// } from '@angular/core';
// import { SystemService, BaseData, HttpClientService } from '../../../providers';
// import * as _ from 'lodash';

// @Component({
//   selector: 'expenseCategory-select',
//   templateUrl: './expense-category-select.component.html',
//   styleUrls: ['./expense-category-select.component.scss']
// })
// export class ExpenseCategorySelectComponent implements OnInit, OnDestroy {
//   @Input() title;
//   @Output() setCategory = new EventEmitter<string>();

//   @Input()
//   set expenseCategoryId(expenseCategoryId) {
//     this.select(_.find(BaseData.expenseCategoryList, { id: expenseCategoryId }));
//   }

//   get expenseCategoryId(): string { return this.expenseCategory.id; }

//   @Input()
//   set expenseBook(expenseBook) {
//     this.expenseBookId = expenseBook.id;
//     this.init();
//   }

//   get expenseBook() {
//     return _.find(BaseData.expenseBookList, { id: this.expenseBookId });
//   }

//   expenseBookId;

//   expenseCategoryList: any;
//   expenseCategoryItem;
//   expenseCategory;

//   resetEvent;
//   doneEvent;

//   isListShow = false;

//   clickId = 'expenseCategory-list';

//   constructor(
//     public system: SystemService,
//     public el: ElementRef,
//     public renderer: Renderer,
//     public viewRef: ViewContainerRef
//   ) { }


//   ngOnInit() {
//     this.init();

//     this.resetEvent = this.system.resetEvent.subscribe(() => {
//       this.init();
//     });
//     this.doneEvent = this.system.doneEvent.subscribe((value) => {
//       if (value && value.model === 'expenseCategory') {
//         this.select(value.data);
//       } else {
//         this.expenseCategoryList = _.filter(BaseData.expenseCategoryList, { expenseBookId: this.expenseBookId });
//         this.select(_.first(this.expenseCategoryList));
//       }
//     });
//   }

//   @HostListener('document:click', ['$event'])
//   onClick() {
//     if (this.el.nativeElement.contains(event.target)) {
//       this.isListShow = !this.isListShow;
//     } else {
//       this.isListShow = false;
//     }
//   }

//   ngOnDestroy() {
//     if (this.resetEvent) {
//       this.resetEvent.unsubscribe();
//     }
//     if (this.doneEvent) {
//       this.doneEvent.unsubscribe();
//     }
//   }

//   init() {
//     this.expenseCategoryList = _.filter(BaseData.expenseCategoryList, { expenseBookId: this.expenseBookId });
//     this.select(_.first(this.expenseCategoryList));
//   }

//   select(item?) {
//     this.expenseCategoryList = _.filter(BaseData.expenseCategoryList, { expenseBookId: this.expenseBookId });
//     this.isListShow = false;
//     if (item) {
//       this.expenseCategoryItem = item;
//       this.expenseCategory = item.name;
//       this.setCategory.emit(this.expenseCategoryItem.id);
//     } else {
//       this.expenseCategoryItem = null;
//       this.expenseCategory = '';
//     }
//   }

//   add() {
//     this.select();
//     this.system.changeComponent({ component: 'expenseCategory-add-edit', data: this.expenseBook });
//   }
// }

import {
  Component, OnInit, Input, OnDestroy, Output, EventEmitter,
  HostListener, ElementRef, Renderer, ViewContainerRef, ViewChild
} from '@angular/core';

import { fromEvent, Subscription } from 'rxjs';

import { map, filter, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { SystemService, BaseData, HttpClientService } from '../../../providers';

import * as _ from 'lodash';

@Component({
  selector: 'expenseCategory-select',
  templateUrl: './expense-category-select.component.html',
  styleUrls: ['./expense-category-select.component.scss']
})

export class ExpenseCategorySelectComponent implements OnInit, OnDestroy {

  @ViewChild('expenseCategoryListEle') expenseCategoryListEle: ElementRef;
  @ViewChild('expenseCategoryInputEle') expenseCategoryInputEle: ElementRef;
  @Input() title;
  @Output() setCategory = new EventEmitter<string>();

  @Input()
  set expenseCategoryId(expenseCategoryId) {
    this.selectItem(_.find(BaseData.expenseCategoryList, { id: expenseCategoryId }));
  }

  get expenseCategoryId(): string { return this.expenseCategory.id; }

  @Input()
  set expenseBook(expenseBook) {
    this.expenseBookId = expenseBook.id;
    this.init();
  }

  get expenseBook() {
    return _.find(BaseData.expenseBookList, { id: this.expenseBookId });
  }

  expenseBookId;

  // expenseCategoryList: any;
  expenseCategoryItem;
  selectedExpenseCategoryItem;
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
      debounceTime(10),
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
          this.showULExpenseCategory();
          break;
        case 40: // 下
          this.expenseCategoryItem = this.list[nextIndex];
          this.expenseCategory = this.expenseCategoryItem.name;
          this.showULExpenseCategory();
          break;
        case 27: // esc
          this.ulShow = false;
          this.selectItem(this.selectedExpenseCategoryItem);
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
      this.selectedExpenseCategoryItem = this.expenseCategoryItem;
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
      this.selectedExpenseCategoryItem = item;
      this.expenseCategoryItem = item;
      this.expenseCategory = item.name;
      this.ulShow = false;
      this.setCategory.emit(this.expenseCategoryItem.id);
    } else {
      this.expenseCategoryItem = null;
      this.expenseCategory = '';
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

  add() {
    this.selectItem();
    this.system.changeComponent({ component: 'expenseCategory-add-edit', data: this.expenseBook });
  }
}

