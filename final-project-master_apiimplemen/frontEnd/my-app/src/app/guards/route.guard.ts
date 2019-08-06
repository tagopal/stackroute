import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenicateService } from '../services/authenicate.service';
import { RouterService } from '../services/router.service';

@Injectable({
  providedIn: 'root'
})
export class RouteGuard implements CanActivate {
  constructor(private auth : AuthenicateService,private router : RouterService){

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return this.auth.isUserAuthenticated(this.auth.getBearerToken()).then(res=>{
        return true;
      }).catch(err=>{
        this.router.routeToLogin();
        return false;
      });
  }
}
