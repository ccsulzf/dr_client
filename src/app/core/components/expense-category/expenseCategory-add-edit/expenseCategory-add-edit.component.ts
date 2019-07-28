import { Component, OnInit, Input } from '@angular/core';
import { HttpClientService, BaseDataService, SystemService } from '../../../providers';
@Component({
  selector: 'expenseCategory-add-edit',
  templateUrl: './expenseCategory-add-edit.component.html',
  styleUrls: ['../../core-form.scss']
})
export class ExpenseCategoryAddEditComponent implements OnInit {
  @Input() data;
  public name = '';
  public memo = '';
  public expenseBook;
  constructor(
    public http: HttpClientService,
    public baseData: BaseDataService,
    public system: SystemService
  ) { }

  ngOnInit() {
    this.expenseBook = this.data.expenseBook;
    if (this.data.value) {
      this.name = this.data.value.name;
      this.memo = this.data.value.memo;
    }
  }

  async addOrEdit() {
    const expenseCategory = await this.http.post('/DR/ExpenseCategory',
      {
        expenseBookId: this.expenseBook.id, name: this.name, memo: this.memo,
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
