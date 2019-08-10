import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) { }

  getChat(id: number){
    return this.http.get(environment.remoteUrl + '/chat/'+id);
  }

  sendMessage(id: number, message: string){
    message = '"' + message + '"';
    return this.http.post(environment.remoteUrl + '/chat/' + id, message, {headers: {'Content-Type':'application/json'}});
  }

  deleteMessage(id: number){
    return this.http.delete(environment.remoteUrl + '/chat/' + id);
  }
}
