import {
  Component, OnInit, Input, OnDestroy, Output, EventEmitter,
  HostListener, ElementRef, Renderer, ViewContainerRef, ViewChild, forwardRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ValidatorFn, AbstractControl, ValidationErrors, NG_VALIDATORS } from '@angular/forms';
import { SystemService, BaseData } from '../../../providers';
import { fromEvent, Subscription } from 'rxjs';
import { map, filter, distinctUntilChanged, switchMap } from 'rxjs/operators';

import * as _ from 'lodash';

export const INCOME_CATEGORY_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => IncomeCategorySelectComponent),
  multi: true
};
@Component({
  selector: 'incomeCategory-select',
  templateUrl: './incomeCategory-select.component.html',
  styleUrls: ['./incomeCategory-select.component.scss'],
  providers: [INCOME_CATEGORY_ACCESSOR]
})
export class IncomeCategorySelectComponent implements OnInit, OnDestroy {
  @ViewChild('incomeCategoryListEle') incomeCategoryListEle: ElementRef;
  @ViewChild('incomeCategoryInputEle') incomeCategoryInputEle: ElementRef;

  @Input() title;
  list = [];
  incomeCategoryItem;
  incomeCategory;
  doneEvent;

  ulShow = false;
  public changeTabViewEvent: Subscription;
  constructor(
    public system: SystemService,
    public el: ElementRef,
  ) { }

  propagateChange = (temp: any) => { };

  writeValue(value: any) {
    setTimeout(() => {
      if (value) {
        this.select(_.find(BaseData.incomeCategoryList, { id: value }));
      } else {
        this.select(_.first(BaseData.incomeCategoryList));
      }
    });
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any) { }

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
          this.propagateChange(this.incomeCategory.id);
          this.showULIncomeCategory();
          break;
        case 40: // 下
          this.incomeCategoryItem = this.list[nextIndex];
          this.incomeCategory = this.incomeCategoryItem.name;
          this.propagateChange(this.incomeCategory.id);
          this.showULIncomeCategory();
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
      this.showULIncomeCategory();
    }
  }


  // 滚动条滚到相应的元素位置
  showULIncomeCategory() {
    const list = document.getElementById('incomeCategory-ul');
    const targetLi = document.getElementById('incomeCategory_' + this.incomeCategoryItem.id);
    list.scrollTop = (targetLi.offsetTop - 8);
  }

  @HostListener('document:click', ['$event'])
  onClick() {
    if (this.incomeCategoryListEle.nativeElement.contains(event.target)) {
      this.system.selectedTabView = this.title;
      this.ulShow = true;
      this.list = _.cloneDeep(BaseData.incomeCategoryList);
    } else {
      if (!_.find(this.list, (item) => {
        return item.name === this.incomeCategory;
      })) {
        this.incomeCategory = '';
      }
      this.ulShow = false;
    }
  }


  change(value) {
    let incomeCategory = null;
    if (value) {
      incomeCategory = _.find(this.list, (item) => {
        return item.name.indexOf(value) > -1;
      });
    }
    this.select(incomeCategory);
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
  }

  select(item?) {
    if (item) {
      this.incomeCategoryItem = item;
      this.incomeCategory = item.name;
      this.ulShow = false;
      this.propagateChange(item.id);
    } else {
      this.incomeCategoryItem = null;
      this.incomeCategory = '';
      this.propagateChange('');
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
