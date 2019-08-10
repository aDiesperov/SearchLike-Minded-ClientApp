import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) { }

  getComments(id: number) {
    return this.http.get('https://localhost:44339/api/comment/getComments/' + id);
  }

  addComment(postId: number, text: string){
    return this.http.post('https://localhost:44339/api/comment/', {postId, text});
  }

  delComment(commentId: number){
    return this.http.delete('https://localhost:44339/api/comment/' + commentId);
  }
}
