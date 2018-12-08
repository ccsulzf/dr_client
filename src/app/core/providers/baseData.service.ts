import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { SystemService } from './system.service';
import { Subject } from 'rxjs';
import { BaseData } from './base-data';
@Injectable()
export class BaseDataService {

    constructor(
        public http: HttpClientService,
        public system: SystemService,
    ) {

    }

    async getAllBaseData() {
        this.http.get('/DR/ExpenseBook?userId=' + this.system.user.id).then((value: any) => {
            BaseData.expenseBookList = value;
        });

        this.http.get('/DR/Address?userId=' + this.system.user.id).then((value: any) => {
            BaseData.addressList = value;
        });
    }

    getAddressList() {
        return BaseData.addressList;
    }

    getAddress(id) {

    }

    addAddress(item) {
        BaseData.addressList.push(item);
    }

    updateAddress() {

    }

    delAddress() {

    }

    getExpenseBookList() {
        return BaseData.expenseBookList;
    }

    getExpenseBook(id) {

    }

    addExpenseBook(item) {
        BaseData.expenseBookList.push(item);
    }

    updateExpenseBook() {

    }

    delExpenseBook() {

    }

}
