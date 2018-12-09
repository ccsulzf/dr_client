import { Component, OnInit } from '@angular/core';
import { SystemService, HttpClientService, BaseDataService } from '../../../providers';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
@Component({
  selector: 'app-address-add-edit',
  templateUrl: './address-add-edit.component.html',
  styleUrls: ['./address-add-edit.component.scss']
})
export class AddressAddEditComponent implements OnInit {
  public province = '';
  public city = '';
  public area = '';
  public isCurrenLive = 0;
  public memo;

  public cityList = [];
  public areaList = [];
  public data;
  constructor(
    private httpClient: HttpClient,
    private system: SystemService,
    private http: HttpClientService,
    public baseData: BaseDataService
  ) { }

  ngOnInit() {
    this.httpClient.get('assets/province.json')
      .subscribe((data) => {
        this.data = data;
      });
  }

  selectProvince(data) {
    this.province = data;
    const temp = _.find(this.data, (item) => {
      return item.name === data;
    });
    this.cityList = temp.cityList;
  }

  selectCity(data) {
    this.city = data;
    const temp = _.find(this.cityList, (item) => {
      return item.name === data;
    });
    this.areaList = temp.areaList;
  }

  async add() {
    const address = await this.http.post('/DR/Address',
      {
        province: this.province, city: this.city,
        area: this.area, memo: this.memo, isCurrenLive: this.isCurrenLive, userId: this.system.user.id
      });
    if (address) {
      this.baseData.addAddress(address);
      this.system.done();
    }
  }

  cancel() {
    this.system.done();
  }

}
