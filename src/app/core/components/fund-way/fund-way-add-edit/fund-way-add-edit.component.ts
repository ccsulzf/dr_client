import { Component, OnInit, Input } from '@angular/core';
import { HttpClientService, BaseDataService, SystemService } from '../../../providers';

@Component({
  selector: 'app-fund-way-add-edit',
  templateUrl: './fund-way-add-edit.component.html',
  styleUrls: ['./fund-way-add-edit.component.scss']
})
export class FundWayAddEditComponent implements OnInit {
  public name;
  public memo;
  public type = 2;

  constructor(
    public http: HttpClientService,
    public baseData: BaseDataService,
    public system: SystemService
  ) { }

  ngOnInit() {
  }

  async add() {
    const fundWay = await this.http.post('/DR/FundWay',
      {
        userId: this.system.user.id, name: this.name, memo: this.memo, type: this.type
      });
    if (fundWay) {
      this.baseData.addFundWay(fundWay);
      this.system.done({ model: 'fundWay', data: fundWay });
    }
  }


  cancel() {
    this.system.done();
  }

}
