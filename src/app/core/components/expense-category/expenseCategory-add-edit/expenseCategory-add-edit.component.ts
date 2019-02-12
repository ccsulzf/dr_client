import { Component, OnInit, Input } from '@angular/core';
import { HttpClientService, BaseDataService, SystemService } from '../../../providers';
@Component({
  selector: 'expenseCategory-add-edit',
  templateUrl: './expenseCategory-add-edit.component.html',
  styleUrls: ['./expenseCategory-add-edit.component.scss']
})
export class ExpenseCategoryAddEditComponent implements OnInit {
  @Input() data;
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
    const expenseCategory = await this.http.post('/DR/ExpenseCategory',
      {
        expenseBookId: this.data.id, name: this.name, memo: this.memo,
        userId: this.system.user.id
      });
    if (expenseCategory) {
      this.baseData.addExpenseCategory(expenseCategory);
      this.system.done({ model: 'expenseCategory', data: expenseCategory });
    }
  }

  cancel() {
    this.system.done();
  }

}
