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


import { fromEvent } from 'rxjs';
import { ajax } from 'rxjs/ajax';
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

  @Input() title;
  @Output() setCategory = new EventEmitter<string>();

  @Input()
  set expenseCategoryId(expenseCategoryId) {
    this.select(_.find(BaseData.expenseCategoryList, { id: expenseCategoryId }));
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

  isListShow = false;

  clickId = 'expenseCategory-list';

  @ViewChild('expenseCategoryListEle') expenseCategoryListEle: ElementRef;
  ulShow = false;

  userList = [
    { name: 'Slack' },
    { name: 'Hipchat' },
    { name: 'Skype' }
  ];


  list = [];


  user;


  constructor(
    public el: ElementRef,
    public renderer: Renderer,
    public viewRef: ViewContainerRef,
    public system: SystemService,
  ) { }


  ngOnInit() {
    this.list = this.userList;
    const searchBox = document.getElementById('search-box');
    const typeahead = fromEvent(searchBox, 'input').pipe(
      map((e: any) => {
        return e.target.value;
      }),
      filter(text => {
        if (text.length >= 1) {
          return text.length >= 1;
        } else {
          this.list = this.userList;
          this.ulShow = true;
          return false;
        }
      }),
      debounceTime(10),
      distinctUntilChanged(),
      // switchMap(() => ajax('/api/endpoint'))
    );
    typeahead.subscribe(data => {
      this.list = this.userList.filter((item) => {
        return item.name.indexOf(data) > -1;
      });
      // Handle the data from the API
    });
  }


  @HostListener('document:click', ['$event'])
  onClick() {
    if (this.expenseCategoryListEle.nativeElement.contains(event.target)) {
      this.ulShow = true;
      this.list = this.userList;
    } else {
      this.list = this.userList.filter((item) => {
        return item.name.indexOf(this.user) > -1;
      });


      if (this.list && this.list.length === 0) {
        this.user = '';
      }
      this.ulShow = false;
    }
  }


  selectItem(item) {
    this.user = item.name;
    this.ulShow = false;
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

  ngOnDestroy() {
    if (this.resetEvent) {
      this.resetEvent.unsubscribe();
    }
    if (this.doneEvent) {
      this.doneEvent.unsubscribe();
    }
  }
}

