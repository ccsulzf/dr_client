import {
  Component, OnInit, OnDestroy, Input,
  EventEmitter, Output, ViewChild,
  ElementRef, HostListener
} from '@angular/core';
import { SystemService, BaseData } from '../../../providers';
import { fromEvent } from 'rxjs';
import { map, filter, distinctUntilChanged, switchMap } from 'rxjs/operators';
import * as _ from 'lodash';
@Component({
  selector: 'participant-select',
  templateUrl: './participant-select.component.html',
  styleUrls: ['./participant-select.component.scss']
})
export class ParticipantSelectComponent implements OnInit, OnDestroy {
  @ViewChild('participantListEle') participantListEle: ElementRef;
  @ViewChild('contentEle') contentEle: ElementRef;
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
  list = [];

  top = 0;
  filterParticipant = '';
  ulShow = false;

  doneEvent;

  constructor(
    public system: SystemService
  ) { }

  ngOnInit() {
    this.init();

    const searchBox = document.getElementById('participant-list');
    const typeahead = fromEvent(searchBox, 'input').pipe(
      map((e: any) => {
        return e.target.value;
      }),
      filter(text => {
        if (text.length >= 1) {
          return text.length >= 1;
        } else {
          this.list = this.participantList;
          this.ulShow = true;
          return false;
        }
      }),
      distinctUntilChanged()
    );
    typeahead.subscribe(data => {
      this.list = this.participantList.filter((item) => {
        return item.name.indexOf(data) > -1;
      });
    });
    this.doneEvent = this.system.doneEvent.subscribe((value) => {
      if (value && value.model === 'participant') {
        value.data.selected = true;
        this.selectedParticipantList.push(value.data);
        this.list.push(value.data);
        this.top = this.contentEle.nativeElement.clientHeight;
      }
    });
  }


  @HostListener('document:click', ['$event'])
  onClick() {
    if (this.participantListEle.nativeElement.contains(event.target)) {
      if (event.srcElement.id === 'participant-list') {
        this.ulShow = !this.ulShow;
      } else {
        this.ulShow = true;
        this.list = this.participantList;
      }

      if (!this.ulShow) {
        const searchBox = document.getElementById('participant-list');
        searchBox.blur();
        this.filterParticipant = '';
      }
    } else {
      this.ulShow = false;
      this.filterParticipant = '';
    }
    this.top = this.contentEle.nativeElement.clientHeight;
  }

  ngOnDestroy() {
    if (this.doneEvent) {
      this.doneEvent.unsubscribe();
    }
  }

  init() {
    this.participantList = BaseData.participantList;
    for (const item of this.participantList) {
      item.selected = false;
    }
    const mySelf = _.find(this.participantList, { isMyself: true });
    mySelf.selected = true;
    this.selectedParticipantList.push(mySelf);
    this.list = this.participantList;
    this.top = this.contentEle.nativeElement.clientHeight;
  }


  select(item) {
    this.ulShow = true;
    this.filterParticipant = '';
    item.selected = !item.selected;
    if (item.selected) {
      this.selectedParticipantList.push(item);
    } else {
      _.remove(this.selectedParticipantList, { name: item.name });
    }
    this.setParticipantList.emit(this.selectedParticipantList);

    this.top = this.contentEle.nativeElement.clientHeight;
  }

  add() {
    this.ulShow = false;
    this.system.changeComponent({ component: 'participant-add-edit' });
  }

  delete(item) {
    item.selected = false;
    _.remove(this.selectedParticipantList, { name: item.name });
    this.setParticipantList.emit(this.selectedParticipantList);
    this.top = this.contentEle.nativeElement.clientHeight;
  }
}
