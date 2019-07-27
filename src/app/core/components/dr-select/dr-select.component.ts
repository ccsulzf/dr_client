import { Component, OnInit, OnDestroy, Input, forwardRef, HostListener, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ValidatorFn, AbstractControl, ValidationErrors, NG_VALIDATORS } from '@angular/forms';
import { SystemService, BaseDataService, BaseData } from '../../providers';

import { fromEvent, Subscription } from 'rxjs';
import { map, filter, distinctUntilChanged } from 'rxjs/operators';

import * as _ from 'lodash';

export const DRSELECT_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DRSelectComponent),
  multi: true
};
@Component({
  selector: 'dr-select',
  templateUrl: './dr-select.component.html',
  styleUrls: ['./dr-select.component.scss'],
  providers: [DRSELECT_ACCESSOR]
})
export class DRSelectComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @ViewChild('selectListEle') selectListEle: ElementRef;
  @ViewChild('selectInputEle') selectInputEle: ElementRef;

  @Input() set list(data) {
    this.originList = _.cloneDeep(data);
    this.selectList = data;
  };
  get list() {
    return this.selectList;
  }
  @Input() icon;
  @Input() title;
  @Input() tabIndex;
  @Input() addEditComponentName;
  @Input() addEditComponentData;

  selectedName;
  selectedItem;
  selectList;
  originList;
  ulShow: boolean = false;

  inputFilter: Subscription;
  propagateChange = (temp: any) => { };

  writeValue(value: any) {
    // console.log(this.title);
    // console.log(value);
    if (value) {
      this.selectedItem = _.find(this.list, (item) => {
        return +item.id === +value;
      });
      this.selectItem(this.selectedItem);
    } else {
      // this.selectedName = '';
      this.selectItem();
    }
    // this.cd.detectChanges();
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any) { }

  constructor(
    private system: SystemService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const typeahead = fromEvent(this.selectInputEle.nativeElement, 'input').pipe(
      map((e: any) => {
        return e.target.value;
      }),
      filter(text => {
        if (text.length >= 1) {
          return true;
        } else {
          this.selectList = _.cloneDeep(this.originList);
          this.ulShow = true;
          return false;
        }
      }),
      distinctUntilChanged()
    );
    typeahead.subscribe(data => {
      this.selectList = this.originList.filter((item) => {
        return item.name.indexOf(data) > -1 || this.system.filterByPY(item, 'name', data);
      });
    });
  }

  ngOnDestroy() {
    if (this.inputFilter) {
      this.inputFilter.unsubscribe();
    }
  }

  @HostListener('document:click', ['$event'])
  onClick() {
    if (this.selectListEle.nativeElement.contains(event.target)) {
      this.ulShow = true;
    } else {
      if (!_.find(this.list, (item) => {
        return item.name === this.selectedName;
      })) {
        this.selectedName = '';
      }
      this.ulShow = false;
    }
  }

  @HostListener('keydown', ['$event'])
  hotKeyEvent(e) {
    if (this.ulShow) {
      let index = -1;
      let nextIndex = 0;
      let prevIndex = 0;
      if (this.selectedItem) {
        index = _.findIndex(this.list, { id: this.selectedItem.id });
        nextIndex = (index === this.list.length - 1) ? 0 : index + 1;
        prevIndex = (index === 0) ? this.list.length - 1 : index - 1;
      } else {
        nextIndex = (index === this.list.length - 1) ? 0 : index + 1;
        prevIndex = this.list.length - 1;
      }

      switch (e.keyCode) {
        case 38: // 上
          this.selectedItem = this.list[prevIndex];
          this.selectedName = this.selectedItem.name;
          this.propagateChange(this.selectedItem.id);
          this.showULExpenseCategory();
          break;
        case 40: // 下
          this.selectedItem = this.list[nextIndex];
          this.selectedName = this.selectedItem.name;
          this.propagateChange(this.selectedItem.id);
          this.showULExpenseCategory();
          break;
        case 13:
          e.stopPropagation();
          this.selectItem(this.selectedItem);
          break;
        case 9:
          this.ulShow = false;
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

  change(value) {
    let temp = null;
    if (value) {
      temp = _.find(this.list, (item) => {
        return item.name.indexOf(value) > -1;
      });
    }
    this.selectItem(temp);
  }

  selectItem(item?) {
    if (item) {
      this.selectedName = item.name;
      this.propagateChange(item.id);
      this.ulShow = false;
    } else {
      this.selectedName = '';
      this.propagateChange('');
    }
  }

  showULExpenseCategory() {
    const list = document.getElementById(this.title);
    const targetLi = document.getElementById(this.title + this.selectedItem.id);
    list.scrollTop = (targetLi.offsetTop - 8);
  }

  add() {
    this.selectItem();
    this.system.changeComponent({ component: this.addEditComponentName, data: this.addEditComponentData });
  }

}
