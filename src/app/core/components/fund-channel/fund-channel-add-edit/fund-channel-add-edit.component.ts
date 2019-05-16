import { Component, OnInit, Input } from '@angular/core';
import { HttpClientService, BaseDataService, SystemService } from '../../../providers';
@Component({
  selector: 'app-fund-channel-add-edit',
  templateUrl: './fund-channel-add-edit.component.html',
  styleUrls: ['../../core-form.scss']
})
export class FundChannelAddEditComponent implements OnInit {
  @Input() data;
  public name;
  public memo;

  constructor(
    public http: HttpClientService,
    public baseData: BaseDataService,
    public system: SystemService
  ) { }

  ngOnInit() {
    if (this.data) {
      this.name = this.data.name;
      this.memo = this.data.memo;
    }
  }

  async addOrEdit() {
    const fundChannel = await this.http.post('/DR/FundChannel',
      {
        userId: this.system.user.id, name: this.name, memo: this.memo
      });
    if (fundChannel) {
      this.baseData.addFundChannel(fundChannel);
      this.system.done({ model: 'fundChannel', data: fundChannel });
    }
  }


  cancel() {
    this.system.done();
  }
}
