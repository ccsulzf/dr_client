import {
  Component, OnInit, Input, OnDestroy, ElementRef, ViewChild,
  Output, EventEmitter, HostListener, AfterViewInit, Renderer2
} from '@angular/core';
import { SystemService, HttpClientService } from '../../../providers';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
@Component({
  selector: 'label-select',
  templateUrl: './label-select.component.html',
  styleUrls: ['./label-select.component.scss']
})
export class LabelSelectComponent implements OnInit, OnDestroy {
  @Input() title;
  @Input() type;
  @Output() setLabelList = new EventEmitter<any>();
  @ViewChild('inputLabel') inputLabel: ElementRef;
  @ViewChild('contentLabel') contentLabel: ElementRef;
  @Input()
  set hasLabelList(hasLabelList) {
    this.labelList = hasLabelList;
  }

  get hasLabelList() { return this.labelList; }

  labelList = [];
  isInputShow = false;
  name;

  resetEvent;

  // public changeTabViewEvent: Subscription;
  constructor(
    public system: SystemService,
    public http: HttpClientService,
    public render: Renderer2
  ) { }

  ngOnInit() {
    this.resetEvent = this.system.resetEvent.subscribe(() => {
      this.labelList = [];
    });

    // this.changeTabViewEvent = this.system.changeTabViewEvent.subscribe((value) => {
    //   if (value === this.title) {
    //     this.showLabel();
    //     this.system.selectedTabView = value;
    //   } else {
    //     this.isInputShow = false;
    //   }
    // });
  }

  ngOnDestroy() {
    if (this.resetEvent) {
      this.resetEvent.unsubscribe();
    }
    // if (this.changeTabViewEvent) {
    //   this.changeTabViewEvent.unsubscribe();
    // }
  }

  // @HostListener('focus', ['$event'])
  // foucs(){
  //   console.log(123123);
  // }

  @HostListener('document:click', ['$event'])
  onClick() {
    if (this.contentLabel.nativeElement.contains(event.target)) {
      this.showLabel();
    } else {
      this.isInputShow = false;
    }
  }

  async hotKeyEvent(e) {
    if (this.isInputShow) {
      switch (e.keyCode) {
        case 13:
          await this.addLabel();
          break;
        case 27:
          // e.stopPropagation();
          this.isInputShow = false;
          this.name = '';
          break;
        default:
          break;
      }
    } else if (!this.isInputShow && e.keyCode === 13) {
      // e.stopPropagation();
      this.isInputShow = true;
    }
    return true;
  }

  showLabel() {
    this.isInputShow = true;
    setTimeout(() => {
      this.inputLabel.nativeElement.focus();
    });
  }

  focus() {
    if (!this.isInputShow) {
      this.showLabel();
    } else {
      // this.isInputShow = false;
    }
  }

  blur() {
    this.isInputShow = false;
    console.log('main blur');
  }

  test() {
    console.log('input blur');
  }
  async addLabel() {
    if (!_.find(this.labelList, { name: this.name })) {
      const label = await this.http.post('/DR/addLabel', {
        type: this.type,
        userId: this.system.user.id,
        name: this.name
      });
      this.isInputShow = false;
      this.labelList.push(label);
      this.name = '';
      this.showLabel();
      this.setLabelList.emit(this.labelList);
    } else {
      // this.isInputShow = false;
      this.name = '';
    }
  }

  // async blur() {
  //   console.info(123);
  //   if (this.name) {
  //     await this.addLabel();
  //   } else {
  //     this.isInputShow = false;
  //   }
  // }

  delete(item) {
    _.remove(this.labelList, item);
    this.setLabelList.emit(this.labelList);
  }
}
