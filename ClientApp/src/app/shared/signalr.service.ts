import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  
  connection: signalR.HubConnection;

  constructor() {
    let Token = localStorage.getItem('Token');
    this.connection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl("https://localhost:44339/hubSR", { accessTokenFactory: () => Token })
      .build();

    // this.connection.on('setConnectionId', (connectionId: number) => {
    //   document.cookie = "conn-id=" + connectionId;
    // })

    this.connection.start().then(() => {
      console.log('Connected!');
    }).catch(function (err) {
      return console.error(err.toString());
    });
   }

   invoke(method: string, ...args: any): Promise<any>{
      return new Promise((resolve, reject) => {
        if(this.connection.state == signalR.HubConnectionState.Connected){
          this.connection.invoke(method, ...args).then(res => resolve(res)).catch(err => reject(err));
        }
        else{
          let tmp = setInterval(() => {
            if(this.connection.state == signalR.HubConnectionState.Connected){
              clearInterval(tmp);
              this.connection.invoke(method, ...args).then(res => resolve(res)).catch(err => reject(err));
            }
          }, 1000);
        }
      })
   }
}
