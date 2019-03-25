import { Component, OnInit, Input, Output, EventEmitter, HostListener, ViewChild, ElementRef } from '@angular/core';
import { ReportService } from '../../../../services';
import { BaseDataService, BaseData } from '../../../../../../core/providers';
import * as _ from 'lodash';
@Component({
  selector: 'report-equal',
  templateUrl: './report-equal.component.html',
  styleUrls: ['./report-equal.component.scss']
})
export class ReportEqualComponent implements OnInit {
  @Input() data;
  @Output() selectEqual = new EventEmitter<any>();

  baseData;
  list = [];
  selectedList = [];


  @ViewChild('optionULSelect') optionULSelect: ElementRef;
  @ViewChild('selectOption') selectOption: ElementRef;
  labelShow = false;
  isListShow = false;

  placeholder;
  constructor(
    public reportService: ReportService,
    public el: ElementRef,
  ) {
    this.baseData = BaseData;
  }

  ngOnInit() {
    this.placeholder = this.data.name;
    this.list = this.baseData[`${this.data.code}List`];
    for (let item of this.list) {
      item.selected = false;
    }
  }

  divClick() {
    this.labelShow = !this.labelShow;
    if (this.labelShow) {
      this.placeholder = '';
    } else {
      this.placeholder = this.data.name;
    }
  }

  del(e) {
    e.stopPropagation();
    this.reportService.removeSelect({
      code: this.data.code,
      type: this.data.type
    });
  }


  @HostListener('document:click', ['$event'])
  onClick() {
    if (this.selectOption.nativeElement.contains(event.target)) {
      this.isListShow = !this.isListShow;
      if (this.isListShow) {
        this.labelShow = true;
        this.setPlaceHolder();
      }
    } else {
      if (this.optionULSelect.nativeElement.contains(event.target)) {
        this.isListShow = true;
        this.labelShow = true;
        this.setPlaceHolder();
      } else {
        this.isListShow = false;
      }
    }
  }

  setPlaceHolder() {
    if (this.selectedList && this.selectedList.length) {
      this.placeholder = `已选(+${this.selectedList.length})`;
      this.labelShow = true;
    } else {
      this.placeholder = this.data.name;
      this.labelShow = false;
    }
  }

  select(data, item) {
    if (data) {
      item.selected = data;
      this.selectedList.push(item)
    } else {
      _.remove(this.selectedList, item);
      item.selected = data;
    }
    this.selectEqual.emit({
      code: this.data.code,
      list: this.selectedList
    });
    this.setPlaceHolder();
  }

}
