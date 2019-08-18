import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) { }

  getComments(id: number) {
    return this.http.get(environment.remoteUrl_api + '/comment/getComments/' + id);
  }

  addComment(postId: number, text: string){
    return this.http.post(environment.remoteUrl_api + '/comment/', {postId, text});
  }

  delComment(commentId: number){
    return this.http.delete(environment.remoteUrl_api + '/comment/' + commentId);
  }
}
