import {
  Component, OnInit, Input, OnDestroy, Output, EventEmitter,
  HostListener, ElementRef, Renderer, ViewContainerRef,
  ViewChild
} from '@angular/core';
import { SystemService, BaseData } from '../../../providers';

import { fromEvent, Subscription } from 'rxjs';
import { map, filter, distinctUntilChanged, switchMap } from 'rxjs/operators';

import * as _ from 'lodash';
@Component({
  selector: 'incomeCategory-select',
  templateUrl: './incomeCategory-select.component.html',
  styleUrls: ['./incomeCategory-select.component.scss']
})
export class IncomeCategorySelectComponent implements OnInit, OnDestroy {
  @ViewChild('incomeCategoryListEle') incomeCategoryListEle: ElementRef;
  @ViewChild('incomeCategoryInputEle') incomeCategoryInputEle: ElementRef;
  @Input() title;
  @Output() setCategory = new EventEmitter<string>();

  // incomeCategoryList = [];

  list = [];
  incomeCategoryItem;
  selectedIncomeCategoryItem;
  incomeCategory;

  @Input()
  set incomeCategoryId(incomeCategoryId) {
    this.select(_.find(BaseData.incomeCategoryList, { id: incomeCategoryId }));
  }

  get incomeCategoryId(): string { return this.incomeCategory; }

  doneEvent;

  ulShow = false;
  public changeTabViewEvent: Subscription;
  constructor(
    public system: SystemService,
    public el: ElementRef,
  ) { }

  ngOnInit() {
    this.init();
    // this.system.tabViewList.add(this.title);
    const searchBox = document.getElementById('incomeCategory-list');
    const typeahead = fromEvent(searchBox, 'input').pipe(
      map((e: any) => {
        return e.target.value;
      }),
      filter(text => {
        if (text.length >= 1) {
          return text.length >= 1;
        } else {
          this.list = _.cloneDeep(BaseData.incomeCategoryList);
          this.ulShow = true;
          return false;
        }
      }),
      distinctUntilChanged()
    );
    typeahead.subscribe(data => {
      this.list = BaseData.incomeCategoryList.filter((item) => {
        return item.name.indexOf(data) > -1 && this.system.filterByPY(item, 'name', data);
      });
    });


    this.doneEvent = this.system.doneEvent.subscribe((value) => {
      if (value && value.model === 'incomeCategory') {
        this.select(value.data);
        this.list = _.cloneDeep(BaseData.incomeCategoryList);
      }
    });

    this.changeTabViewEvent = this.system.changeTabViewEvent.subscribe((value) => {
      if (value === this.title) {
        this.incomeCategoryInputEle.nativeElement.focus();
        this.ulShow = true;
        this.system.selectedTabView = value;
        this.showULIncomeCategory();
      } else {
        this.ulShow = false;
        this.incomeCategoryInputEle.nativeElement.blur();
      }
    });
  }


  @HostListener('keyup', ['$event'])
  hotKeyEvent(e) {
    if (this.ulShow) {
      const index = _.findIndex(this.list, { id: this.incomeCategoryItem.id });
      const nextIndex = (index === this.list.length - 1) ? 0 : index + 1;
      const prevIndex = (index === 0) ? this.list.length - 1 : index - 1;
      switch (e.keyCode) {
        case 38: // 上
          this.incomeCategoryItem = this.list[prevIndex];
          this.incomeCategory = this.incomeCategoryItem.name;
          this.showULIncomeCategory();
          break;
        case 40: // 下
          this.incomeCategoryItem = this.list[nextIndex];
          this.incomeCategory = this.incomeCategoryItem.name;
          this.showULIncomeCategory();
          break;
        case 27: // esc
          this.ulShow = false;
          this.select(this.selectedIncomeCategoryItem);
          break;
        case 13:
          e.stopPropagation();
          this.select(this.incomeCategoryItem);
          break;
        default:
          break;
      }
    } else if (!this.ulShow && e.keyCode === 13) {
      e.stopPropagation();
      this.ulShow = true;
      this.selectedIncomeCategoryItem = this.incomeCategoryItem;
      this.showULIncomeCategory();
    }
  }



  @HostListener('document:click', ['$event'])
  onClick() {
    if (this.incomeCategoryListEle.nativeElement.contains(event.target)) {
      this.ulShow = true;
    } else {
      if (!_.find(this.list, (item) => {
        return item.name === this.incomeCategory;
      })) {
        this.incomeCategory = '';
      }
      this.ulShow = false;
    }
  }

  // 滚动条滚到相应的元素位置
  showULIncomeCategory() {
    const list = document.getElementById('incomeCategory-ul');
    const targetLi = document.getElementById('incomeCategory_' + this.incomeCategoryItem.id);
    list.scrollTop = (targetLi.offsetTop - 8);
  }

  ngOnDestroy() {
    if (this.doneEvent) {
      this.doneEvent.unsubscribe();
    }
    if (this.changeTabViewEvent) {
      this.changeTabViewEvent.unsubscribe();
    }
  }

  init() {
    this.list = _.cloneDeep(BaseData.incomeCategoryList);
    this.select(_.first(this.list));
  }

  select(item?) {
    if (item) {
      this.incomeCategoryItem = item;
      this.incomeCategory = item.name;
      this.selectedIncomeCategoryItem = item;
      this.ulShow = false;
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

  edit(e, item) {
    e.stopPropagation();
    this.ulShow = false;
    this.system.changeComponent({ component: 'incomeCategory-add-edit', data: item });
  }

}
