import {
  Component, OnInit, Input, OnDestroy, Output, EventEmitter,
  HostListener, ElementRef, Renderer, ViewContainerRef, ViewChild, forwardRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ValidatorFn, AbstractControl, ValidationErrors, NG_VALIDATORS } from '@angular/forms';
import { SystemService } from '../../providers';
import { Subscription } from 'rxjs';

export const MEMO_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MemoComponent),
  multi: true
};

@Component({
  selector: 'memo',
  templateUrl: './memo.component.html',
  styleUrls: ['./memo.component.scss'],
  providers: [MEMO_ACCESSOR]
})
export class MemoComponent implements OnInit, ControlValueAccessor, OnDestroy {

  @ViewChild('memoInputEle') memoInputEle: ElementRef;

  @Input() title;
  // 最多可以填写多少字
  @Input() maxNumber;

  public memo;

  public memoLength = 0;

  public changeTabViewEvent: Subscription;

  constructor(
    public system: SystemService
  ) { }

  propagateChange = (temp: any) => { };

  writeValue(value: any) {
    setTimeout(() => {
      this.getMemo(value);
    });
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any) { }

  ngOnInit() {
    this.changeTabViewEvent = this.system.changeTabViewEvent.subscribe((value) => {
      if (value === this.title) {
        this.memoInputEle.nativeElement.focus();
        this.system.selectedTabView = value;
      } else {
        this.memoInputEle.nativeElement.blur();
      }
    });
  }

  ngOnDestroy() {
    if (this.changeTabViewEvent) {
      this.changeTabViewEvent.unsubscribe();
    }
  }

  // @HostListener('keyup', ['$event'])
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
        this.propagateChange(this.memo);
        // this.setMemo.emit(memo);
      } else {
        this.memoLength = this.maxNumber;
      }
    } else {
      this.memoLength = 0;
      this.memo = '';
      this.propagateChange(this.memo);
      // this.setMemo.emit(memo);
    }
  }


}
