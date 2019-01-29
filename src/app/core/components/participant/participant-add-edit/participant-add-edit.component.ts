import { Component, OnInit } from '@angular/core';
import { SystemService, HttpClientService, BaseDataService } from '../../../providers';

@Component({
  selector: 'app-participant-add-edit',
  templateUrl: './participant-add-edit.component.html',
  styleUrls: ['./participant-add-edit.component.scss']
})
export class ParticipantAddEditComponent implements OnInit {

  public participant = {
    name: '',
    alias: '',
    memo: '',
    isMyself: false,
    userId: this.system.user.id
  };
  constructor(
    public system: SystemService,
    public http: HttpClientService,
    public baseData: BaseDataService
  ) { }

  ngOnInit() {
  }

  async add() {
    const participant = await this.http.post('/DR/Participant', this.participant);
    if (participant) {
      this.baseData.addParticipant(participant);
      this.system.done({ model: 'participant', data: participant });
    }
  }

  cancel() {
    this.system.done();
  }

}
