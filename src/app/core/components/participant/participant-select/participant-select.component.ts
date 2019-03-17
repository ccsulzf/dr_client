import { Component, OnInit, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { SystemService, BaseDataService, BaseData } from '../../../providers';
import * as _ from 'lodash';
@Component({
  selector: 'participant-select',
  templateUrl: './participant-select.component.html',
  styleUrls: ['./participant-select.component.scss']
})
export class ParticipantSelectComponent implements OnInit, OnDestroy {
  @Input() title;
  @Output() setParticipantList = new EventEmitter<any>();
  // 已选择的
  selectedParticipantList;

  @Input()
  set hasParticipantList(hasParticipantList) {
    this.selectedParticipantList = hasParticipantList;
    this.participantList = _.differenceBy(BaseData.participantList, this.selectedParticipantList, 'name');
  }

  get hasParticipantList(): string { return this.selectedParticipantList; }


  participantList = [];

  isListShow = false;

  showListEvent;
  doneEvent;

  clickId = 'participant-select';
  constructor(
    public system: SystemService
  ) { }

  ngOnInit() {
    this.init();

    this.showListEvent = this.system.showListEvent.subscribe((data) => {
      if (this.clickId === data.id) {
        this.isListShow = !this.isListShow;
      } else {
        if (data.id) {
          this.isListShow = false;
        }
      }
    });

    this.doneEvent = this.system.doneEvent.subscribe((value) => {
      if (value && value.model === 'participant') {
        this.select(value.data);
      }
    });
  }

  ngOnDestroy() {
    if (this.showListEvent) {
      this.showListEvent.unsubscribe();
    }

    if (this.doneEvent) {
      this.doneEvent.unsubscribe();
    }
  }

  init() {
    this.participantList = BaseData.participantList;
    this.select(_.find(BaseData.participantList, { isMyself: true }));
  }

  select(item?) {
    this.isListShow = false;
    if (item) {
      this.participantList = BaseData.participantList;
      this.selectedParticipantList.push(item);
      this.participantList = _.differenceBy(this.participantList, this.selectedParticipantList, 'name');
      this.setParticipantList.emit(this.selectedParticipantList);
    }
  }

  add() {
    this.select();
    this.system.changeComponent({ component: 'participant-add-edit' });
  }

  delete(item) {
    this.participantList = BaseData.participantList;
    _.remove(this.selectedParticipantList, item);
    this.participantList = _.differenceBy(this.participantList, this.selectedParticipantList, 'name');
    this.setParticipantList.emit(this.selectedParticipantList);
  }
}
