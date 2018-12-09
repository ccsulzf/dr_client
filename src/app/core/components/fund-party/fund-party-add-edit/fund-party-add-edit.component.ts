import { Component, OnInit, Input } from '@angular/core';
import { HttpClientService, BaseDataService, SystemService } from '../../../providers';
@Component({
  selector: 'app-fund-party-add-edit',
  templateUrl: './fund-party-add-edit.component.html',
  styleUrls: ['./fund-party-add-edit.component.scss']
})
export class FundPartyAddEditComponent implements OnInit {
  @Input() data;
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
    this.type = this.data;
  }

  async add() {
    const fundParty = await this.http.post('/DR/FundParty',
      {
        userId: this.system.user.id, name: this.name, memo: this.memo,
        category: this.category, type: this.type
      });
    if (fundParty) {
      this.baseData.addFundParty(fundParty);
      this.system.done();
    }
  }


  cancel() {
    this.system.done();
  }


}
