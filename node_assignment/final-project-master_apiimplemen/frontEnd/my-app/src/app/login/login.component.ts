import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { AuthenicateService } from '../services/authenicate.service';
import { RouterService } from '../services/router.service';

import { ErrorStateMatcher } from '@angular/material/core';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  showSpinner = false;
  hide = true;
  errMessage = '';
  username = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);

  matcher = new MyErrorStateMatcher();

  constructor(private auth: AuthenicateService, private router: RouterService) {
    if (this.auth.getBearerToken() !== '') {
      this.router.routeToDashboard();
    }
  }

  ngOnInit() {

  }

  login() {
    this.showSpinner = true;
    this.auth.authenticateUser({ username: this.username.value, password: this.password.value }).subscribe(res => {
      console.log("response in login   :", res);
      this.auth.setBearerToken(res['token']);
      this.auth.setUserId(res['data']['id']);
      this.auth.setUserName(res['data']['username']);
      this.auth.setFriends(res['data']['friendsList']);
      this.auth.checkToken();
      this.router.routeToDashboard();
    }, err => {
      this.showSpinner = false;
      this.errMessage = "username/password is incorrect";
    });
  }

  onKey() {
    this.errMessage = "";
  }

}
