import { Injectable } from '@angular/core';
import { Observable,BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FilternotesService {

  favoriteSubject= new BehaviorSubject<any>('');
  favorite=this.favoriteSubject.asObservable();

  constructor() { }

  favoriteTrigger(value){
    this.favoriteSubject.next(value);
  }

  getFavorite():BehaviorSubject<any>{
    return this.favoriteSubject;
  }

}
