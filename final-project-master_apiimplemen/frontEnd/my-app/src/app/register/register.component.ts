import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { AuthenicateService } from '../services/authenicate.service';
import { RouterService } from '../services/router.service';
import {MatSnackBar} from '@angular/material';

import {ErrorStateMatcher} from '@angular/material/core';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  showSpinner = false;
  hide=true;
  errMessage="";
  successMsg="";
  username = new FormControl('',[Validators.required]);
  password = new FormControl('',[Validators.required]);
  firstname = new FormControl('',[Validators.required]);
  lastname = new FormControl('',[Validators.required]);

  matcher = new MyErrorStateMatcher();

  constructor(private auth : AuthenicateService,private router : RouterService,private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  register(){
    this.showSpinner = true;
    this.successMsg = '';
    this.errMessage = '';
    this.auth.registerUser({firstname:this.firstname.value,lastname:this.lastname.value,username:this.username.value,password:this.password.value}).subscribe(res=>{
      const response: any = res;
      if (response.code !== undefined) {
        this.errMessage = response.message;
        this.showSpinner = false;
      } else {
        console.log("response in register  :",res);
        this.successMsg="Account is created"
        this.showSpinner = false;
        this.openSnackBar('Account is created','login with credential');
        setTimeout(()=>{
          this.router.routeToLogin();
        },600);
      }
    },err=>{
      console.log("error in register  :",err);
      this.errMessage=err['error'];
      this.showSpinner = false;
    });
  }

  onKey(){
    this.errMessage="";
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 1000,
    });
  }

}
