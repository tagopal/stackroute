import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import * as io from 'socket.io-client';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket; //socket connects our server

  constructor() {
    this.socket = io(environment.socketUrl);

    this.socket.on('connect', () => {
      console.log("connected to server", this.socket.connected); // true
      console.log("this.soccket :", this.socket);
      this.socket.emit('sharetoUser', 'message');
    });

    this.socket.on('disconnect', () => {
      console.log("Disconnected from server", this.socket.disconnected); // true
      console.log("trying to reconnect");
      this.socket.open();
    });
  }

  getSocket() {
    return this.socket;
  }
}
