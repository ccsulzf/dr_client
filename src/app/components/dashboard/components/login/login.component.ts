import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services';
import { BaseDataService } from '../../../../core/providers';
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
    public router: Router,
    public baseData: BaseDataService
  ) { }

  ngOnInit() {

  }

  async login() {
    const flag = await this.loginService.login(this.nameOrEmali, this.password);
    if (flag) {
      await this.baseData.getAllBaseData();
      this.router.navigateByUrl('/dashboard/home');
    }
  }

}
