import { Component, OnInit, Input, Output, EventEmitter, HostListener, ViewChild, ElementRef } from '@angular/core';
import { SystemService } from '../../providers';
import { Subscription } from 'rxjs';
@Component({
  selector: 'memo',
  templateUrl: './memo.component.html',
  styleUrls: ['./memo.component.scss']
})
export class MemoComponent implements OnInit {
  @ViewChild('memoInputEle') memoInputEle: ElementRef;

  @Input() title;
  // 最多可以填写多少字
  @Input() maxNumber;

  @Output() setMemo = new EventEmitter<any>();

  public memo;
  @Input()
  set hasMemo(memo) {
    this.memo = memo;
  }

  get hasMemo() {
    return this.memo;
  }

  public memoLength = 0;

  constructor(

  ) { }

  ngOnInit() {
  }

  @HostListener('keyup', ['$event'])
  hotKeyEvent(e) {
    switch (e.keyCode) {
      case 13:
        e.stopPropagation();
        break;
      case 27:
        this.memoInputEle.nativeElement.blur();
        break;
      default:
        break;
    }
  }

  getMemo(memo) {
    if (memo) {
      this.memoLength = memo.length;
      if (this.memoLength <= this.maxNumber) {
        this.memo = memo;
        this.setMemo.emit(memo);
      } else {
        this.memoLength = this.maxNumber;
      }
    } else {
      this.memoLength = 0;
      this.memo = '';
      this.setMemo.emit(memo);
    }
  }


}
