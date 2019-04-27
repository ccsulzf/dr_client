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

// 输入框获得光标的时候,显示ul
// 1.选择列表元素,input显示选择的值,ul消失
// 2.输入框输入进行过滤,没有的话显示提示信息,请添加,移除光标时,如果你输入框的值不是列表的值,则清空内容
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

  expenseCategoryList: any;
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


  ngOnInit() {
    this.list = this.expenseCategoryList;
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
          this.list = this.expenseCategoryList;
          this.ulShow = true;
          return false;
        }
      }),
      debounceTime(10),
      distinctUntilChanged()
    );
    typeahead.subscribe(data => {
      this.list = this.expenseCategoryList.filter((item) => {
        return item.name.indexOf(data) > -1;
      });
    });

    this.resetEvent = this.system.resetEvent.subscribe(() => {
      this.init();
    });
    this.doneEvent = this.system.doneEvent.subscribe((value) => {
      if (value && value.model === 'expenseCategory') {
        this.selectItem(value.data);
        this.list.push(value.data);
        this.expenseCategoryList.push(value.data)
      }
    });

    this.changeTabViewEvent = this.system.changeTabViewEvent.subscribe((value) => {
      if (value === this.title) {
        this.ulShow = true;
        this.system.selectedTabView = value;
      } else {
        this.expenseCategoryInputEle.nativeElement.blur();
        this.ulShow = false;
      }
    });
  }

  init() {
    this.expenseCategoryList = _.filter(BaseData.expenseCategoryList, { expenseBookId: this.expenseBookId });
    this.list = this.expenseCategoryList;
    this.selectItem(_.first(this.expenseCategoryList));
  }

  selectItem(item?) {
    if (item) {
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
      this.ulShow = true;
      this.list = this.expenseCategoryList;
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
    this.system.changeComponent({ component: 'expenseCategory-add-edit', data: this.expenseBook });
  }
}

