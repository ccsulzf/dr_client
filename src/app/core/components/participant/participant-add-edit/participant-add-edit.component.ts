import { Component, OnInit, Input } from '@angular/core';
import { SystemService, HttpClientService, BaseDataService } from '../../../providers';

@Component({
  selector: 'app-participant-add-edit',
  templateUrl: './participant-add-edit.component.html',
  styleUrls: ['../../core-form.scss']
})
export class ParticipantAddEditComponent implements OnInit {
  @Input() data;
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
    if (this.data) {
      this.participant = this.data;
    }
  }

  async addOrEdit() {
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
