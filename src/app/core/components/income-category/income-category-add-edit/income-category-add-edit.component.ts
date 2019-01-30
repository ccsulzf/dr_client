import { Component, OnInit } from '@angular/core';
import { HttpClientService, BaseDataService, SystemService } from '../../../providers';
@Component({
  selector: 'app-income-category-add-edit',
  templateUrl: './income-category-add-edit.component.html',
  styleUrls: ['./income-category-add-edit.component.scss']
})
export class IncomeCategoryAddEditComponent implements OnInit {

  public name = '';
  public memo = '';
  constructor(
    public http: HttpClientService,
    public baseData: BaseDataService,
    public system: SystemService
  ) { }

  ngOnInit() {
  }

  async add() {
    const incomeCategory = await this.http.post('/DR/IncomeCategory',
      {
        name: this.name, memo: this.memo,
        userId: this.system.user.id
      });
    if (incomeCategory) {
      this.baseData.addIncomeCategory(incomeCategory);
      this.system.done({ model: 'incomeCategory', data: incomeCategory });
    }
  }

  cancel() {
    this.system.done();
  }


}
