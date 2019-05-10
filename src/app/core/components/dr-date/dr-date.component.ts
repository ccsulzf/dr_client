import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, HostListener, OnDestroy, Renderer2 } from '@angular/core';
import { SystemService } from '../../providers';
import { Subscription } from 'rxjs';

import { monthsList, weekList } from './da-date.comfig';
import * as _ from 'lodash';
@Component({
  selector: 'dr-date',
  templateUrl: './dr-date.component.html',
  styleUrls: ['./dr-date.component.scss']
})
export class DrDateComponent implements OnInit, OnDestroy {

  @Input() name;

  // input 和 text两种类型
  @Input() type;

  @Input() size;
  // 视图类型年月日
  @Input() viewType;

  @Input()
  set initDate(initDate) {
    this.date = initDate || new Date();
  }

  get initDate() {
    return this.date;
  }

  @Output() setDate = new EventEmitter<Object>();

  @ViewChild('drDateLabelEle') drDateLabelEle: ElementRef;
  @ViewChild('dateInput') dateInput: ElementRef;

  public changeTabViewEvent: Subscription;

  public show = false;
  public viewTypeList = [];
  public month;
  public year;
  public day;
  public monthDays;
  public date;

  public startYear;
  public endYear;

  public daysList = [];
  public yearsList = [];

  public weekList = [];
  public monthsList = [];
  constructor(
    private system: SystemService,
    public el: ElementRef
  ) {
    this.weekList = weekList;
    this.monthsList = monthsList;
  }

  ngOnInit() {
    this.date = this.initDate || new Date();
    this.getMonth(new Date(this.date).getMonth() + 1);
    this.getYear();
    this.getDay(this.date);
    this.getYearList(this.year);
    this.monthDays = this.getMonthDays();
    this.getViewTypeList(this.viewType);
    this.getList();

    if (this.name) {
      this.system.tabViewList.add(this.name);
    }
    this.changeTabViewEvent = this.system.changeTabViewEvent.subscribe((value) => {
      if (value === this.name) {
        this.system.selectedTabView = value;
        this.dateInput.nativeElement.focus();
        this.show = true;
      } else {
        this.show = false;
        if (this.dateInput && this.dateInput.nativeElement) {
          this.dateInput.nativeElement.blur();
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.changeTabViewEvent) {
      this.changeTabViewEvent.unsubscribe();
    }
  }

  getViewTypeList(viewType) {
    switch (viewType) {
      case 'day':
        this.viewTypeList = ['year', 'month', 'day'];
        this.date = '' + this.year + '-' + this.month.value + '-' + (this.day < 10 ? '0' + this.day : this.day);
        break;
      case 'month':
        this.date = '' + this.year + '-' + this.month.value;
        this.viewTypeList = ['year', 'month'];
        break;
      case 'year':
        this.date = '' + this.year;
        this.viewTypeList = ['year'];
        break;
      default:
        break;
    }
  }

  @HostListener('keyup', ['$event'])
  hotKeyEvent(e) {
    if (e.keyCode === 13) {
      e.stopPropagation();
      this.show = !this.show;
    }
  }

  @HostListener('document:click', ['$event'])
  onClick() {
    if (this.el.nativeElement.contains(event.target)) {
      if (this.el.nativeElement.contains(this.drDateLabelEle.nativeElement)) {
        this.show = !this.show;
        if (this.show) {
          this.system.selectedTabView = this.name;
        }
      } else {
        this.show = true;
        this.viewType = this.viewTypeList[this.viewTypeList.length - 1];
        if (this.type === 'input') {
          this.dateInput.nativeElement.focus();
          this.system.selectedTabView = this.name;
        }
      }
    } else {
      this.show = false;
    }
  }

  getYear() {
    this.year = new Date(this.date).getFullYear();
  }

  getMonth(month?) {
    if (!month) {
      month = new Date().getMonth() + 1;
    }
    const monthItem = monthsList.find((item) => {
      return item.number === month;
    });
    this.month = monthItem;
  }


  getDay(date?) {
    this.day = date ? new Date(date).getDate() : new Date().getDate();
  }


  getYearList(year) {
    this.yearsList = [];
    year = year + '';

    const list = year.slice(0, 3).split('');
    list.push('0');

    this.startYear = +list.join('');
    list.pop();

    list.push('9');
    this.endYear = +list.join('');

    for (let i = (this.startYear - 1); i <= (this.endYear + 1); i++) {
      this.yearsList.push(i);
    }
  }


  getMonthDays(year?, month?) {
    const curDate = new Date();
    curDate.setFullYear(year || this.year);
    curDate.setMonth(month || this.month.number);
    curDate.setDate(0);
    return curDate.getDate();
  }


  getWeekDay(date?) {
    if (!date) {
      return new Date().getDay() || 7;
    } else {
      return new Date(date).getDay() || 7;
    }
  }


  getPrevMonthDays(month) {
    const prevMonth = (month.number - 1 === 0) ? 12 : (month.number - 1);
    const year = (month.number - 1 === 0) ? this.year - 1 : this.year;
    return this.getMonthDays(year, prevMonth);
  }

  getLastMonthDays(month) {
    const lastMonth = month.number === 12 ? 1 : (month.number + 1);
    const year = month.number === 12 ? this.year + 1 : this.year;
    return this.getMonthDays(year, lastMonth);
  }


  getList() {
    /**
    * 首先看月份的第一天是星期几
    * 如果是星期一,则不需要往前推,否则就往前推(weekDay-1)天
    * 再看月份的最后一天是星期几
    * 如果是星期日,则不需要进行处理,否则就往后推(7-weekDay)天
    * {
    *   year
    *   month
    *   day
    *   value
    * }
    */
    const monthFirst = this.getWeekDay(`${this.year}-${this.month.number}-1`);
    const monthLast = this.getWeekDay(`${this.year}-${this.month.number}-${this.monthDays}`);

    const prevMonthDays = this.getPrevMonthDays(this.month);

    let list = [];
    if (monthFirst !== 1) {
      const prevMonth = (this.month.number - 1 === 0) ? 12 : (this.month.number - 1);
      const year = (this.month.number - 1 === 0) ? this.year - 1 : this.year;
      for (let i = 0; i < (monthFirst - 1); i++) {
        list.push({
          year: year,
          month: prevMonth,
          day: prevMonthDays - i,
        });
      }
      list = list.reverse();
    }

    for (let i = 1; i <= this.monthDays; i++) {
      list.push({
        year: this.year,
        month: this.month.number,
        day: i,
      });
    }

    if (monthLast !== 7) {
      const lastMonth = this.month.number === 12 ? 1 : (this.month.number + 1);
      const year = this.month.number === 12 ? this.year + 1 : this.year;
      for (let i = 1; i <= (7 - monthLast); i++) {
        list.push({
          year: year,
          month: lastMonth,
          day: i,
        });
      }
    }

    this.daysList = list;
  }


  prev(e) {
    e.stopPropagation();
    if (this.viewType === 'day') {
      const value = (this.month.number - 1 === 0) ? 12 : (this.month.number - 1);
      this.year = (this.month.number - 1 === 0) ? this.year - 1 : this.year;
      this.getMonth(value);
      this.getList();
    } else if (this.viewType === 'month') {
      this.year = this.year - 1;
    } else if (this.viewType === 'year') {
      this.getYearList(this.startYear - 1);
    }
  }

  next(e) {
    e.stopPropagation();
    if (this.viewType === 'day') {
      const value = this.month.number === 12 ? 1 : (this.month.number + 1);
      this.year = this.month.number === 12 ? this.year + 1 : this.year;
      this.getMonth(value);
      this.getList();
    } else if (this.viewType === 'month') {
      this.year = this.year + 1;
    } else if (this.viewType === 'year') {
      this.getYearList(this.endYear + 1);
    }
  }

  viewYear(e) {
    e.stopPropagation();
    this.viewType = 'year';
  }

  viewMonth(e) {
    e.stopPropagation();
    this.viewType = 'month';
  }


  selectMonth(item, e) {
    e.stopPropagation();
    if (this.viewTypeList[this.viewTypeList.length - 1] === 'day') {
      this.month = item;
      this.viewType = 'day';
      this.monthDays = this.getMonthDays();
      this.getList();
    } else {
      this.month = item;
      this.date = '' + this.year + '-' + this.month.value;
      this.show = false;
    }
    if (this.viewType === 'input') {
      this.dateInput.nativeElement.focus();
      this.system.selectedTabView = this.name;
    }
    this.setDate.emit({
      name: this.name,
      date: this.date
    });
  }

  selectToday(e) {
    this.selectDay(new Date().getDate(), e);
  }


  selectDay(day, e) {
    e.stopPropagation();
    this.day = day;
    this.date = '' + this.year + '-' + this.month.value + '-' + (this.day < 10 ? '0' + this.day : this.day);
    this.show = false;
    if (this.viewType === 'input') {
      this.dateInput.nativeElement.focus();
      this.system.selectedTabView = this.name;
    }
    this.setDate.emit({
      name: this.name,
      date: this.date
    });
  }


  selectYear(item, e) {
    e.stopPropagation();
    if ((this.viewTypeList[this.viewTypeList.length - 1] === 'day') || (this.viewTypeList[this.viewTypeList.length - 1] === 'month')) {
      this.year = item;
      this.viewType = 'month';
    } else {
      this.year = item;
      this.date = '' + this.year;
      this.show = false;
    }
    if (this.viewType === 'input') {
      this.dateInput.nativeElement.focus();
      this.system.selectedTabView = this.name;
    }
    this.setDate.emit({
      name: this.name,
      date: this.date
    });
  }

}
