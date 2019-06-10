import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { HttpClientService, BaseDataService } from '../../../../../core/providers';
import { TransferService } from '../../../services';

import * as _ from 'lodash';
import { Subscription } from 'rxjs';
@Component({
  selector: 'transfer-list',
  templateUrl: './transfer-list.component.html',
  styleUrls: ['./transfer-list.component.scss']
})
export class TransferListComponent implements OnInit, AfterViewInit, OnDestroy {
  public date;
  changeListByDateEvent: Subscription;
  constructor(
    public transferService: TransferService,
    public http: HttpClientService,
  ) { }

  ngOnInit() {
    this.date = this.transferService.transferListDate;
    this.getListByDate(this.transferService.transferListDate);
  }

  ngAfterViewInit() {
    this.changeListByDateEvent = this.transferService.changeListByDateEvent.subscribe((date) => {
      this.getListByDate(date);
    });
  }

  ngOnDestroy() {
    if (this.changeListByDateEvent) {
      this.changeListByDateEvent.unsubscribe();
    }
  }

  edit(detail) {
    this.transferService.transfer = detail;
    this.transferService.edit(_.cloneDeep(detail));
  }

  changeDate(data) {
    this.date = data.date;
    this.getListByDate(data.date);
  }

  getListByDate(transferListDate) {
    this.transferService.transferListDate = transferListDate;
    this.http.get('/DR/getTransferList?transferListDate=' + transferListDate).then((data: any) => {
      this.transferService.transferList = [];
      if (data && data.length) {
        for (const item of data) {
          this.transferService.changeTransfer(item);
        }
      }
    });
  }
}
