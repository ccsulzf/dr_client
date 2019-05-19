import { Component, OnInit, Input, HostListener } from '@angular/core';
import { SystemService, HttpClientService, BaseDataService } from '../../../providers';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
@Component({
  selector: 'app-address-add-edit',
  templateUrl: './address-add-edit.component.html',
  styleUrls: ['../../core-form.scss']
})
export class AddressAddEditComponent implements OnInit {
  @Input() data;
  public address = {
    id: '',
    province: '',
    city: '',
    area: '',
    isCurrenLive: 0,
    memo: ''
  }

  public cityList = [];
  public areaList = [];
  public addressData;

  constructor(
    public httpClient: HttpClient,
    public system: SystemService,
    public http: HttpClientService,
    public baseData: BaseDataService
  ) { }

  ngOnInit() {
    this.httpClient.get('assets/province.json')
      .subscribe((data) => {
        this.addressData = data;
        if (this.data) {
          this.address = this.data;
          this.selectProvince(this.address.province);
          this.selectCity(this.address.city);
        }
      });
  }

  selectProvince(data) {
    this.address.province = data;
    const temp = _.find(this.addressData, (item) => {
      return item.name === data;
    });
    this.cityList = temp.cityList;
  }

  selectCity(data) {
    this.address.city = data;
    const temp = _.find(this.cityList, (item) => {
      return item.name === data;
    });
    this.areaList = temp.areaList;
  }

  @HostListener('keyup', ['$event'])
  hotKeyEvent(e) {
    e.stopPropagation();
  }

  async addOrEdit() {
    const address = await this.http.post('/DR/addOrEditAddress',
      this.address
    );
    if (this.data) {

    } else {

      if (address) {
        this.baseData.addAddress(address);
        this.system.done({ model: 'address', data: address });
      }
    }
  }

  cancel() {
    this.system.done({ model: 'address', data: null });
  }

}
