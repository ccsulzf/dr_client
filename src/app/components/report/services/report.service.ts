import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable()
export class ReportService {
    public removeSelectEvent = new Subject<string>();

    public removeSelect(value) {
        this.removeSelectEvent.next(value);
    }
}