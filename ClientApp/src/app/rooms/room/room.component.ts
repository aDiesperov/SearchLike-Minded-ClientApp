import {
  Component,
  OnInit
} from '@angular/core';
import { ChatService } from 'src/app/shared/chat.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from 'src/app/models/message.model';
import { NgxUiLoaderService, SPINNER } from 'ngx-ui-loader';
import { SignalrService } from 'src/app/shared/signalr.service';
import { RoomService } from 'src/app/shared/room.service';
import { UserInfo } from 'src/app/models/userInfo.model';
import { DashboardService } from 'src/app/shared/dashboard.service';
import { Figure } from 'src/app/models/figure.model';
import { WebRTCService } from 'src/app/shared/web-rtc.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.sass']
})

export class RoomComponent implements OnInit {
  constructor(
    private chat: ChatService,
    private route: ActivatedRoute,
    private router: Router,
    private ngxLoader: NgxUiLoaderService,
    private room: RoomService,
    private signalr: SignalrService,
    private dashboard: DashboardService,
    private webRTC: WebRTCService
  ) {
    this.signalr.connection.on('startLive', (user: UserInfo) => this.room.lives.push(user));
    this.signalr.connection.on('stopLive', 
       (userId: number) => this.room.lives = this.room.lives.filter(l => l.id != userId));

    this.signalr.connection.on('offer', (userId: number, desc: string) => {
      if(this.localStream !== null)
        webRTC.createAnswer(userId, desc, this.localStream);
    });
    this.signalr.connection.on('answer', (userId: number, desc: string) => {
      webRTC.acceptAnswer(userId, desc);
    });

    this.signalr.connection.on('candidate', (userId: number, data: string) => {
      webRTC.receiveCandidate(userId, data);
    });

  }

  roomId: number;
  SPINNER = SPINNER.cubeGrid;
  loadedMessages: Message[];
  loadedFigures: Figure[];

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.ngxLoader.startLoader('loader-01');

      this.signalr.invoke('leaveGroup');
      if (this.localStream) {
        this.closeLocalStream();
        this.signalr.connection.invoke('stopLive');
        document.querySelector(".live .active").classList.remove('active');
      }
      this.loadedMessages = new Array<Message>();
      this.loadedFigures = new Array<Figure>();
      this.room.lives = new Array<UserInfo>();

      this.roomId = +params.id;
      if (Number.isNaN(this.roomId)) this.router.navigateByUrl('/room');
      this.signalr.invoke('joinGroup', this.roomId).then(
        res => {
          if(res){
            this.dashboard.getFigures(this.roomId).subscribe(
              (res: Figure[]) => this.loadedFigures = res
            )
      
            this.room.getLives(this.roomId).subscribe(
              (res: UserInfo[]) => this.room.lives = res
            );
      
            this.chat.getChat(this.roomId).subscribe((res: Message[]) => {
              this.loadedMessages = res;
              this.ngxLoader.stopLoader('loader-01');
            });
          }
          else this.router.navigateByUrl('/room');
        }
      )
      
    }); 

    document.getElementById('live_video').addEventListener('click', this.onLive.bind(this));
    document.getElementById('live_audio').addEventListener('click', this.onLive.bind(this));
  }

  localStream: MediaStream;

  closeLocalStream(){
    if(this.localStream != null){
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
  }

  onLive(event) {
    let target = event.currentTarget as HTMLElement;
    if (target.classList.contains('active')) {
      this.signalr.connection.invoke('stopLive');
      target.classList.remove('active');
      this.closeLocalStream();
    } else {
      target.classList.add('show');
      if (target.id == 'live_video') {
        target.nextElementSibling.classList.remove('active');
        target.nextElementSibling.classList.remove('show');
      } else {
        target.previousElementSibling.classList.remove('active');
        target.previousElementSibling.classList.remove('show');
      }
      this.webRTC.getStream(target.id == 'live_video').then(mediaStream => {
        if(this.localStream){
          target.classList.add('active');
          this.closeLocalStream();
          this.localStream = mediaStream;
        }
        this.signalr.connection.invoke('startLive', this.roomId).then( res => {
          if(res){
            target.classList.add('active');
            this.localStream = mediaStream;
          }
        });
      });
    }
  }
}
