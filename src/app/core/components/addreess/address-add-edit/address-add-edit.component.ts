import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
@Component({
  selector: 'app-address-add-edit',
  templateUrl: './address-add-edit.component.html',
  styleUrls: ['./address-add-edit.component.scss']
})
export class AddressAddEditComponent implements OnInit {
  public province = "";
  public city = "";
  public area = "";
  public isCurrenLive = 0;
  public memo;

  public cityList = [];
  public areaList = [];
  public data;
  constructor(
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.http.get('assets/province.json')
      .subscribe((data) => {
        this.data = data;
      });
  }

  selectProvince(data) {
    let temp = _.find(this.data, (item) => {
      return item.name === data;
    });
    this.cityList = temp.cityList;
  }

  selectCity(data) {
    let temp = _.find(this.cityList, (item) => {
      return item.name === data;
    });
    this.areaList = temp.areaList;
  }
}
