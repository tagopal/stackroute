import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import 'rxjs/add/operator/map';
import { RouterService } from './router.service';
@Injectable()
export class AuthenticationService {

    constructor(private http: HttpClient, private routerService:RouterService) {}

    authenticateUser({username, password}) {
        return this.http.post('http://localhost:3000/api/v1/users/login', {username, password});
    }
    registerUser({username, password}) {
        return this.http.post('http://localhost:3000/api/v1/users/register', {username, password});
    }

    setUserDetails(details){
        localStorage.setItem('userName', details.username);
        localStorage.setItem('userId', details.userId);
    }
    removeUserDetails(){
        localStorage.removeItem('userName');
        localStorage.removeItem('userId');
    }
    setBearerToken(token) {
        localStorage.setItem('bearerToken', token);
    }

    getUserId(){
        return localStorage.getItem('userId');
    }
    getBearerToken() {
        return localStorage.getItem('bearerToken');
    }

    removeBearerToken() {
        localStorage.removeItem('bearerToken');
        this.routerService.routeToLogin();
    }
    isUserAuthenticated(token): Promise<boolean> {
        return this.http.post('http://localhost:3000/api/v1/isAuthenticated', {}, {
            headers: new HttpHeaders()
            .set('Authorization', `Bearer ${token}`)
        })
        .map((res) => res['isAuthenticated'])
        .toPromise();
    }
    // isUserAuthenticated(token): Promise<boolean> {
    //     console.log("token :",token);
    //     return new Promise((resolve , reject) => {
    //       this.http.post('http://localhost:3000/api/v1/isAuthenticated', {},
    //         {headers : new HttpHeaders().set(`Authorization`, `Bearer ${token}`)}
    //       ).subscribe( res => {
    //         console.log("Response in authenticateUser :",res);
    //         resolve(res['isAuthenticated']);
    //       }, err => {
    //         console.log("Error in authenticateUser",err);
    //           reject(err);
    //       });
    //     });
    // } 
}

