import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'report-equal',
  templateUrl: './report-equal.component.html',
  styleUrls: ['./report-equal.component.scss']
})
export class ReportEqualComponent implements OnInit {
  @Input() data;
  @Output() test = new EventEmitter<string>();

  labelShow = false;

  placeholder;
  constructor() { }

  ngOnInit() {
    this.placeholder = this.data.name;
  }

  divClick() {
    this.labelShow = !this.labelShow;
    if(this.labelShow){
      this.placeholder = '';
    } else {
       this.placeholder = this.data.name;
    }
  }

  inputFocus() {
    this.labelShow = true;
    this.placeholder = '';
  }

  inputBlur() {
    this.labelShow = false;
    this.placeholder = this.data.name;
  }
  butClick() {
    console.info('点击按钮');
    this.test.emit('我按了一个按钮');
  }
}
