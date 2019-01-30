import { Component, OnInit, Input, OnDestroy, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { SystemService, HttpClientService } from '../../../providers';
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
  @ViewChild('inputText') inputText: ElementRef;

  labelList = [];
  isInputShow = false;

  showInputEvent;

  name;
  constructor(
    private system: SystemService,
    private http: HttpClientService
  ) { }

  ngOnInit() {
  }

  showLabel() {
    this.isInputShow = true;
    setTimeout(() => {
      this.inputText.nativeElement.focus();
    });
  }

  ngOnDestroy() {
    if (this.showInputEvent) {
      this.showInputEvent.unsubscribe();
    }
  }

  async  keyUpEvent(key) {
    switch (key.which) {
      case 13:
        await this.addLabel();
        break;
      default:
        break;
    }
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
      this.setLabelList.emit(this.labelList);
    } else {
      this.isInputShow = false;
      this.name = '';
    }
  }

  async blur() {
    if (this.name) {
      await this.addLabel();
    } else {
      this.isInputShow = false;
    }
  }

  delete(item) {
    _.remove(this.labelList, item);
    this.setLabelList.emit(this.labelList);
  }
}
