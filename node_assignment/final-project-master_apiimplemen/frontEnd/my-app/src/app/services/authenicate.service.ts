import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AuthenicateService {

  constructor(private httpClient: HttpClient) {
    this.checkToken();
  }

  authURL = environment.userUrl; // credential url
  loginRegSubject = new BehaviorSubject<boolean>(false);
  dataLoginReg = this.loginRegSubject.asObservable();
  friendListArray: Array<any> = [];
  friendListSubject = new BehaviorSubject<Array<any>>([]);
  friendList = this.friendListSubject.asObservable();

  setFriends(friends) {
    this.friendListArray = friends;
    this.friendListSubject.next(this.friendListArray);
    return localStorage.setItem('friendList', JSON.stringify(this.friendListArray));
  }

  getFriends() {
    this.friendListArray = JSON.parse(localStorage.getItem('friendList'));
    this.friendListSubject.next(this.friendListArray);
    // return JSON.Parse(localStorage.getItem('friendList'));
  }
  removeFriends() {
    this.friendListArray = [];
    this.friendListSubject.next(this.friendListArray);
    return localStorage.removeItem('friendList');
  }

  removeUserDetails() {
    localStorage.removeItem('userId');
    localStorage.removeItem('name');
  }

  registerUser(input) {
    console.log("inside register User  :", input);
    return this.httpClient.post(`${this.authURL}register`, input);
    // return new Observable(observer=>{
    //   setTimeout(() => {
    //       observer.next(true);
    //   }, 1000);
    // });
  }

  authenticateUser({ username, password }) {
    console.log("username  :", username);
    console.log("password  :", password);
    return this.httpClient.post(`${this.authURL}login`, { username, password });
  }

  setUserId(id) {
    return localStorage.setItem('userId', id);
  }

  getUserId() {
    return localStorage.getItem('userId');
  }
  setUserName(name) {
    return localStorage.setItem('name', name);
  }

  getUserName() {
    return localStorage.getItem('name');
  }

  setBearerToken(token) {
    return localStorage.setItem('token', token);
  }

  getBearerToken() {
    return localStorage.getItem('token');
  }

  removeBearerToken() {
    return localStorage.removeItem('token');
  }

  isUserAuthenticated(token): Promise<boolean> {
    console.log("token :", token);
    return new Promise((resolve, reject) => {
      this.httpClient.post(this.authURL + 'isAuthenticated', {},
        { headers: new HttpHeaders().set(`Authorization`, `${token}`) }
      ).subscribe(res => {
        console.log("Response in authenticateUser :", res);
        resolve(res['isAuthenticated']);
      }, err => {
        console.log("Error in authenticateUser", err);
        reject(err);
      });
    });
  }


  checkToken(): BehaviorSubject<boolean> {
    console.log("this.getBearerToken()  :", this.getBearerToken());
    if (this.getBearerToken()) {
      console.log("Inside the checkToken true : so dashboard has search bar");
      this.loginRegSubject.next(true);
    } else {
      console.log("Inside the checkToken fasle : so dashboard has login");
      this.loginRegSubject.next(false);
    }
    return;
  }


}
