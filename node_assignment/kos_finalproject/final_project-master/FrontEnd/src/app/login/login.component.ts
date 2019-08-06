import { Component, OnInit } from '@angular/core';
import { Register } from '../register';
import { FormControl, Validator, Validators} from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { RouterService } from '../services/router.service';
import { NotesService } from '../services/notes.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  public bearerToken: any;
  public submitMessage: string;
  public registerActive : boolean = false;
  constructor( private _authService: AuthenticationService, private routerService: RouterService, private notesService:NotesService ) { }

  ngOnInit() {
  }

  loginSubmit() {
      const user: Register = new Register(this.username.value, this.password.value);
    console.log('loginForm', user);
    this._authService.authenticateUser(user).subscribe(res => {
        console.log('result of login');
        console.log(res);
        console.log(res['token']);
        this.bearerToken = res['token'];
        this._authService.setBearerToken(this.bearerToken);
        this._authService.setUserDetails(res['user']);
        this.notesService.fetchNotesFromServer();
        this.routerService.routeToDashboard();
    },
    err => {
        if (err.status === 403) {
            this.submitMessage = err.error.message;
        }else {
            this.submitMessage = err.message;
        }
    }
    );
  }

  registerView(){
      console.log("registerView");
    this.registerActive = !this.registerActive;
  }

    register(){
        console.log("registered");
        const user: Register = new Register(this.username.value, this.password.value);
        console.log('registerForm', user);
        this._authService.registerUser(user).subscribe(res => {
            console.log('result of register');
            // console.log(res['token']);
            // this.bearerToken = res['token'];
            // this._authService.setBearerToken(this.bearerToken);
            // this.routerService.routeToDashboard();
            this.registerView();
        },
        err => {
            if (err.status === 403) {
                this.submitMessage = err.error.message;
            }else {
                this.submitMessage = err.message;
            }
        }
        );
    }

  getUserNameErrorMessage() {
      return this.username.hasError('required') ? 'You must enter a value for username' : ' ';
  }
  getPasswordErrorMessage() {
    return this.password.hasError('required') ? 'You must enter a value for password' : ' ';
  }
}
