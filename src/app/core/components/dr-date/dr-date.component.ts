import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'dr-date',
  templateUrl: './dr-date.component.html',
  styleUrls: ['./dr-date.component.scss']
})
export class DrDateComponent implements OnInit {
  // input 和 text两种类型
  @Input() type;

  @Input() viewType;

  @Input() initDate;
  @Output() setDate = new EventEmitter<string>();

  @ViewChild('drDateEle') drDateEle: ElementRef;
  public show = false;

  public viewTypeList = [];

  public month;
  public year;
  public day;
  public monthDays;
  public daysList = [];



  public yearsList = [];
  public startYear;
  public endYear;

  public date;

  public monthsList = [
    { name: '一月', number: 1, value: '01' },
    { name: '二月', number: 2, value: '02' },
    { name: '三月', number: 3, value: '03' },
    { name: '四月', number: 4, value: '04' },
    { name: '五月', number: 5, value: '05' },
    { name: '六月', number: 6, value: '06' },
    { name: '七月', number: 7, value: '07' },
    { name: '八月', number: 8, value: '08' },
    { name: '九月', number: 9, value: '09' },
    { name: '十月', number: 10, value: '10' },
    { name: '十一月', number: 11, value: '11' },
    { name: '十二月', number: 12, value: '12' }
  ];


  public weekList = [
    { name: '一', value: 1 },
    { name: '二', value: 2 },
    { name: '三', value: 3 },
    { name: '四', value: 4 },
    { name: '五', value: 5 },
    { name: '六', value: 6 },
    { name: '日', value: 7 },
  ];
  constructor() { }


  ngOnInit() {
    this.date = this.initDate || new Date();
    this.getMonth(new Date(this.date).getMonth() + 1);
    this.getYear();
    this.getDay(this.date);
    this.getYearList(this.year);
    this.monthDays = this.getMonthDays();
    this.getViewTypeList(this.viewType);
    this.getList();
  }

  getViewTypeList(viewType) {
    switch (viewType) {
      case 'day':
        this.viewTypeList = ['year', 'month', 'day'];
        this.date = '' + this.year + '/' + this.month.value + '/' + (this.day < 10 ? '0' + this.day : this.day);
        break;
      case 'month':
        this.date = '' + this.year + '/' + this.month.value;
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


  @HostListener('document:click', ['$event'])
  onClick() {
    if (this.drDateEle.nativeElement.contains(event.target)) {
      this.show = true;
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
    const monthItem = this.monthsList.find((item) => {
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


  // 2019-01
  // 2018-12
  getPrevMonthDays(month) {
    const prevMonth = (month.number - 1 === 0) ? 12 : (month.number - 1);
    const year = (month.number - 1 === 0) ? this.year - 1 : this.year;
    return this.getMonthDays(year, prevMonth);
  }


  // 2018-12
  // 2019-01
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


  prev() {
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


  next() {
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


  viewYear() {
    this.viewType = 'year';
  }


  viewMonth() {
    this.viewType = 'month';
  }


  selectMonth(item) {
    if (this.viewTypeList[this.viewTypeList.length - 1] === 'day') {
      this.month = item;
      this.viewType = 'day';
      this.monthDays = this.getMonthDays();
      this.getList();
    } else {
      this.month = item;
      this.date = '' + this.year + '/' + this.month.value;
      this.show = false;
    }
    this.setDate.emit(this.date);
  }


  selectDay(day) {
    this.day = day;
    this.date = '' + this.year + '/' + this.month.value + '/' + (this.day < 10 ? '0' + this.day : this.day);
    this.show = false;
    this.setDate.emit(this.date);
  }


  selectYear(item) {
    if ((this.viewTypeList[this.viewTypeList.length - 1] === 'day') || (this.viewTypeList[this.viewTypeList.length - 1] === 'month')) {
      this.year = item;
      this.viewType = 'month';
    } else {
      this.year = item;
      this.date = '' + this.year;
      this.show = false;
    }
    this.setDate.emit(this.date);
  }

}
