import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) {
  }

  addPost(text: string) {
    return this.http.post(environment.remoteUrl_api + '/post/', {text});
  }

  getPosts(userId: number, pub: boolean){
    return this.http.get(environment.remoteUrl_api + '/post/getPosts/' + userId, {params: {pub: pub.toString()}});
  }

  delPost(postId: number) {
    return this.http.delete(environment.remoteUrl_api + '/post/' + postId);
  }

  likePost(postId: number) {
    return this.http.head(environment.remoteUrl_api + '/post/like/' + postId);
  }
}
