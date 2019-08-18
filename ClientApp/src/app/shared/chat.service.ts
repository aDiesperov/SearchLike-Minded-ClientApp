import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Message } from '../models/message.model';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) { }

  messages = new Array<Message>();

  getChat(id: number){
    return this.http.get(environment.remoteUrl_api + '/chat/'+id)
    .pipe(
      tap((res: Message[]) =>
        this.messages = res
      )
    );
  }

  sendMessage(id: number, message: string){
    message = JSON.stringify(message);
    return this.http.post(environment.remoteUrl_api + '/chat/' + id, message, {headers: {'Content-Type':'application/json'}})
    .pipe(
      tap(
        (res: Message) => this.messages.push(res)
      )
    );
  }

  deleteMessage(id: number){
    return this.http.delete(environment.remoteUrl_api + '/chat/' + id)
    .pipe(
      tap(
        res => (this.messages = this.messages.filter(m => m.messageId != id))
      )
    );
  }
}
