import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SystemService, BaseDataService, BaseData } from '../../../providers';
import * as _ from 'lodash';
@Component({
  selector: 'label-select',
  templateUrl: './label-select.component.html',
  styleUrls: ['./label-select.component.scss']
})
export class LabelSelectComponent implements OnInit, OnDestroy {
  @Input() title;

  isInputShow = false;

  showInputEvent;
  constructor(
    private system: SystemService
  ) { }

  ngOnInit() {


  }

  showLabel() {
    this.isInputShow = true;
  }

  ngOnDestroy() {
    if (this.showInputEvent) {
      this.showInputEvent.unsubscribe();
    }

    // if (this.doneEvent) {
    //   this.doneEvent.unsubscribe();
    // }
  }
}
