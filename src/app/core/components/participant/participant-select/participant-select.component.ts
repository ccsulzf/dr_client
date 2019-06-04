import {
  Component, OnInit, OnDestroy, Input,
  EventEmitter, Output, ViewChild,
  ElementRef, HostListener
} from '@angular/core';
import { SystemService, BaseData } from '../../../providers';
import { fromEvent, Subscription } from 'rxjs';
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

  // 上下选择的元素,来控制样式
  choiceItem;

  @Input()
  set hasParticipantList(hasParticipantList) {
    this.list = _.cloneDeep(BaseData.participantList);
    for (const item of this.list) {
      if (_.find(hasParticipantList, { id: item.id })) {
        item.selected = true;
      } else {
        item.selected = false;
      }
    }
    this.selectedParticipantList = hasParticipantList;
    this.getSelectedParticipantNames();
  }

  get hasParticipantList(): string { return this.selectedParticipantList; }

  list = [];

  selectedParticipantNames = '';
  ulShow = false;

  public doneEvent: Subscription;
  public changeTabViewEvent: Subscription;

  constructor(
    public system: SystemService
  ) { }

  ngOnInit() {
    this.init();
    this.doneEvent = this.system.doneEvent.subscribe((value) => {
      if (value && value.model === 'participant') {
        value.data.selected = true;
        this.selectedParticipantList.push(value.data);
        this.getSelectedParticipantNames();
        this.list.push(value.data);
      }
    });

    this.changeTabViewEvent = this.system.changeTabViewEvent.subscribe((value) => {
      if (value === this.title) {
        this.ulShow = true;
        this.system.selectedTabView = value;
        this.choiceItem = null;
        document.getElementById('participant-list').focus();
      } else {
        this.ulShow = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.doneEvent) {
      this.doneEvent.unsubscribe();
    }
    if (this.changeTabViewEvent) {
      this.changeTabViewEvent.unsubscribe();
    }
  }

  @HostListener('document:click', ['$event'])
  onClick() {
    if (this.participantListEle.nativeElement.contains(event.target)) {
      this.system.selectedTabView = this.title;
      if (event.srcElement.id === 'participant-list') {
        this.ulShow = !this.ulShow;
      } else {
        this.ulShow = true;
      }
    } else {
      this.ulShow = false;
    }
    this.choiceItem = null;
  }


  @HostListener('keyup', ['$event'])
  hotKeyEvent(e) {
    if (this.ulShow) {
      let listIndex = -1;
      let listNextIndex = 0;
      let listPrevIndex = 0;
      if (this.choiceItem) {
        listIndex = _.findIndex(this.list, { id: this.choiceItem.id });
        listNextIndex = (listIndex === this.list.length - 1) ? 0 : listIndex + 1;
        listPrevIndex = (listIndex === 0) ? this.list.length - 1 : listIndex - 1;
      } else {
        listPrevIndex = this.list.length - 1;
        listNextIndex = (listIndex === this.list.length - 1) ? 0 : listIndex + 1;
      }
      switch (e.keyCode) {
        case 38: // 上
          this.choiceItem = this.list[listPrevIndex];
          this.showULParticipant();
          break;
        case 40: // 下
          this.choiceItem = this.list[listNextIndex];
          this.showULParticipant();
          break;
        case 13:
          e.stopPropagation();
          this.select(this.choiceItem);
          break;
        default:
          break;
      }
    } else if (!this.ulShow && e.keyCode === 13) {
      e.stopPropagation();
      this.ulShow = true;
    }
  }

  // 滚动条滚到相应的元素位置
  showULParticipant() {
    const list = document.getElementById('participant-ul');
    const targetLi = document.getElementById('participant_' + this.choiceItem.id);
    list.scrollTop = (targetLi.offsetTop - 8);
  }

  getSelectedParticipantNames() {
    const namesList = [];
    for (const item of this.selectedParticipantList) {
      if (item.alias) {
        namesList.push(item.alias);
      } else {
        namesList.push(item.name);
      }
    }
    this.selectedParticipantNames = namesList.join(',');
  }


  init() {
    this.list = _.cloneDeep(BaseData.participantList);
    for (const item of this.list) {
      item.selected = false;
    }
    const mySelf = _.find(this.list, { isMyself: true });
    mySelf.selected = true;
    this.selectedParticipantList.push(mySelf);
    this.getSelectedParticipantNames();
  }

  select(item) {
    this.ulShow = true;
    item.selected = !item.selected;
    if (item.selected) {
      this.selectedParticipantList.push(item);
    } else {
      _.remove(this.selectedParticipantList, { name: item.name });
    }
    this.setParticipantList.emit(this.selectedParticipantList);
    this.getSelectedParticipantNames();
  }

  add() {
    setTimeout(() => {
      this.ulShow = false;
      this.system.changeComponent({ component: 'participant-add-edit' });
    });
  }

  delete(item) {
    item.selected = false;
    _.remove(this.selectedParticipantList, { name: item.name });
    this.setParticipantList.emit(this.selectedParticipantList);
    this.getSelectedParticipantNames();
  }
}
