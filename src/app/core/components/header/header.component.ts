import { Component, OnInit } from '@angular/core';
import { SystemService } from '../../providers';
import { Router, ActivatedRoute, Route } from '@angular/router';
import { remote } from 'electron';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    public router: Router,
    public system: SystemService
  ) { }

  ngOnInit() {
  }

  min() {
    const window = remote.getCurrentWindow();
    window.minimize();
  }

  close() {
    const window = remote.getCurrentWindow();
    window.close();
  }

  logout() {
    this.router.navigateByUrl('/dashboard');
    this.system.deleteUser();
  }

}
