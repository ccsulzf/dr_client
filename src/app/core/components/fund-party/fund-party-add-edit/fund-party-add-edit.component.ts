import { Component, OnInit, Input } from '@angular/core';
import { HttpClientService, BaseDataService, SystemService } from '../../../providers';
@Component({
  selector: 'app-fund-party-add-edit',
  templateUrl: './fund-party-add-edit.component.html',
  styleUrls: ['../../core-form.scss']
})
export class FundPartyAddEditComponent implements OnInit {
  @Input() data;
  public title;
  public type;
  public name;
  public category = 1;
  public memo;
  constructor(
    public http: HttpClientService,
    public baseData: BaseDataService,
    public system: SystemService
  ) { }

  ngOnInit() {
    this.type = this.data.type;
    this.title = this.data.title;

    if (this.data.value) {
      this.category = this.data.value.category;
      this.memo = this.data.value.memo;
      this.name = this.data.value.name;
    }
  }

  async addOrEdit() {
    const fundParty = await this.http.post('/DR/FundParty',
      {
        userId: this.system.user.id, name: this.name, memo: this.memo,
        category: this.category, type: this.type
      });
    if (fundParty) {
      this.baseData.addFundParty(fundParty);
      this.system.done({ model: 'fundParty', data: fundParty });
    }
  }


  cancel() {
    this.system.done();
  }


}
