import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserInfo } from '../models/userInfo.model';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private http: HttpClient) { }

  getRooms(){
    return this.http.get(environment.remoteUrl + '/room');
  }

  lives = new Array<UserInfo>();

  getLives(roomId: number){
    return this.http.get(environment.remoteUrl + '/room/getLives/'+ roomId);
  }
}
