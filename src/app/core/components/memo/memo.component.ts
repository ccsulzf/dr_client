import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'memo',
  templateUrl: './memo.component.html',
  styleUrls: ['./memo.component.scss']
})
export class MemoComponent implements OnInit {
  @Input() title;
  // 最多可以填写多少字
  @Input() maxNumber;

  @Output() setMemo = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }

}
