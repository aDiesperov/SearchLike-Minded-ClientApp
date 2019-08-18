import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserInfo } from '../models/userInfo.model';
import { Room } from '../models/room.model';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  constructor(private http: HttpClient) {}

  getRooms() {
    return this.http
      .get(environment.remoteUrl_api + '/room')
      .pipe(tap((res: Room[]) => (this.rooms = res)));
  }

  lives = new Array<UserInfo>();
  rooms = new Array<Room>();

  getLives(roomId: number) {
    return this.http
      .get(environment.remoteUrl_api + '/room/getLives/' + roomId)
      .pipe(
        tap(
          (res: UserInfo[]) => (this.lives = res)
          )
      );
  }

  createRoom(title: string, participants: string[], image) {
    const fd = new FormData();
    if (title !== null) fd.append('title', title);
    participants.forEach(p => {
      fd.append('participants[]', p);
    });
    if (image != null) fd.append('image', image);
    return this.http.put(environment.remoteUrl_api + '/room/createRoom', fd);
  }
}
