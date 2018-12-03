import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public nameOrEmali;
  public password;
  constructor(
    public loginService: LoginService,
    public router: Router
  ) { }

  ngOnInit() {
  }

  async login() {
    let flag = await this.loginService.login(this.nameOrEmali, this.password);
    if (flag) {
      this.router.navigateByUrl('/dashboard/home')
    }
  }

}
