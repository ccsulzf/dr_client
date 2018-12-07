import { Component, OnInit } from '@angular/core';
import { SystemService } from '../../providers';
import { Router } from '@angular/router';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  public user;
  constructor(
    private router: Router,
    private system: SystemService
  ) { }

  ngOnInit() {
    this.user = this.system.user;
  }

  toAccount() {
    this.router.navigateByUrl('/account');
  }

  logout() {
    this.router.navigateByUrl('/dashboard');
    this.system.deleteUser();
  }

}
