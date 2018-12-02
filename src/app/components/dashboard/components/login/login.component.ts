import { Component, OnInit } from '@angular/core';
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
    public loginService: LoginService
  ) { }

  ngOnInit() {
  }

  login() {
    let flag = this.loginService.login(this.nameOrEmali, this.password);
    console.info(flag);
  }

}
