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
            console.info(value);
            BaseData.expenseBookList = value;
        });
    }

    getExpenseBookList() {
        return BaseData.expenseBookList;
    }

    getExpenseBook(id) {

    }

    addExpenseBook() {

    }

    updateExpenseBook() {

    }

    delExpenseBook() {

    }

}
