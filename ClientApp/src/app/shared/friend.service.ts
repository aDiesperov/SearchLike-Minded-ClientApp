import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FriendService {

  constructor(private http: HttpClient) { }

  getFriends() {
    return this.http.get(environment.remoteUrl_api + '/friend');
  }

  getFriendsSmallInfo(){
    return this.http.get(environment.remoteUrl_api + '/friend/getFriendsSmallInfo');
  }

  getFollowers() {
    return this.http.get(environment.remoteUrl_api + '/friend/followers');
  }

  addFriend(userId: number) {
    return this.http.get(environment.remoteUrl_api + '/friend/addFriend/' + userId);
  }

  delFriend(userId: number) {
    return this.http.delete(environment.remoteUrl_api + '/friend/delFriend/' + userId);
  }

  unfollow(userId: number) {
    return this.http.delete(environment.remoteUrl_api + '/friend/unfollow/' + userId);
  }

  getOnline(){
    return this.http.get(environment.remoteUrl_api + '/friend/online')
  }
}
