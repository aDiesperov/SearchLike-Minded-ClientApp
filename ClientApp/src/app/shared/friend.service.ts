import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FriendService {

  constructor(private http: HttpClient) { }

  getFriends() {
    return this.http.get(environment.remoteUrl + '/friend');
  }

  getFollowers() {
    return this.http.get(environment.remoteUrl + '/friend/followers');
  }

  addFriend(userId: number) {
    return this.http.get(environment.remoteUrl + '/friend/addFriend/' + userId);
  }

  delFriend(userId: number) {
    return this.http.delete(environment.remoteUrl + '/friend/delFriend/' + userId);
  }

  unfollow(userId: number) {
    return this.http.delete(environment.remoteUrl + '/friend/unfollow/' + userId);
  }
}
