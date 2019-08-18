import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel, HubConnectionState } from '@aspnet/signalr';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  
  connection: HubConnection;

  constructor() {
    let Token = localStorage.getItem('Token');
    this.connection = new HubConnectionBuilder()
      .configureLogging(LogLevel.Information)
      .withUrl(environment.remoteUrl_signalR, { accessTokenFactory: () => Token })
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
        if(this.connection.state == HubConnectionState.Connected){
          this.connection.invoke(method, ...args).then(res => resolve(res)).catch(err => reject(err));
        }
        else{
          let tmp = setInterval(() => {
            if(this.connection.state == HubConnectionState.Connected){
              clearInterval(tmp);
              this.connection.invoke(method, ...args).then(res => resolve(res)).catch(err => reject(err));
            }
          }, 1000);
        }
      })
   }
}
