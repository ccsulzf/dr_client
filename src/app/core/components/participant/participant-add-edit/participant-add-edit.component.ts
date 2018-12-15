import { Component, OnInit } from '@angular/core';
import { SystemService, HttpClientService, BaseDataService } from '../../../providers';

@Component({
  selector: 'app-participant-add-edit',
  templateUrl: './participant-add-edit.component.html',
  styleUrls: ['./participant-add-edit.component.scss']
})
export class ParticipantAddEditComponent implements OnInit {

  public name = '';
  public alias = '';
  public memo = '';
  constructor(
    public system: SystemService,
    public http: HttpClientService,
    public baseData: BaseDataService
  ) { }

  ngOnInit() {
  }

  async add() {
    // console.info(this.system.user);
    const participant = await this.http.post('/DR/Participant', { name: this.name, alias: this.alias, memo: this.memo, userId: this.system.user.id });
    if (participant) {
      this.baseData.addParticipant(participant);
      this.system.done();
    }
  }

  cancel() {
    this.system.done();
  }

}
