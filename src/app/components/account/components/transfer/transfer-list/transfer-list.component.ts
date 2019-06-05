import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClientService, BaseDataService } from '../../../../../core/providers';
import { TransferService } from '../../../services';
@Component({
  selector: 'transfer-list',
  templateUrl: './transfer-list.component.html',
  styleUrls: ['./transfer-list.component.scss']
})
export class TransferListComponent implements OnInit, AfterViewInit {
  public date;
  constructor(
    public transferService: TransferService,
    public http: HttpClientService,
  ) { }

  ngOnInit() {
    this.date = this.transferService.transferListDate;
    this.getListByDate(this.transferService.transferListDate);
  }

  ngAfterViewInit() {

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

      console.info(this.transferService.transferList);
    });
  }
}
