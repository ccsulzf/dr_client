import { Component, OnInit, OnDestroy } from '@angular/core';
import { SystemService, BaseDataService, BaseData } from '../../../providers';

@Component({
  selector: 'participant-select',
  templateUrl: './participant-select.component.html',
  styleUrls: ['./participant-select.component.scss']
})
export class ParticipantSelectComponent implements OnInit, OnDestroy {
  isListShow = false;

  showListEvent;
  doneEvent;

  clickId = 'participant-select';
  constructor(
    private system: SystemService
  ) { }

  ngOnInit() {
    this.showListEvent = this.system.showListEvent.subscribe((data) => {
      if (this.clickId === data.id) {
        this.isListShow = !this.isListShow;
      } else {
        if (data.id) {
          this.isListShow = false;
        }
      }
    });

    this.doneEvent = this.system.doneEvent.subscribe((data) => {
      if (data) {
        // this.select(data);
      } else {
        // this.select(_.find(this.addressList, { isCurrenLive: 1 }))
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

}
