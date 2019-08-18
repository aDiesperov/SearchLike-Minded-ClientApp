import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/shared/chat.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from 'src/app/models/message.model';
import { NgxUiLoaderService, SPINNER } from 'ngx-ui-loader';
import { SignalrService } from 'src/app/shared/signalr.service';
import { RoomService } from 'src/app/shared/room.service';
import { UserInfo } from 'src/app/models/userInfo.model';
import { DashboardService } from 'src/app/shared/dashboard.service';
import { WebRTCService } from 'src/app/shared/web-rtc.service';
import { Figure } from 'src/app/models/figure.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.sass']
})
export class RoomComponent implements OnInit {
  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private router: Router,
    private ngxLoader: NgxUiLoaderService,
    private roomService: RoomService,
    private signalrService: SignalrService,
    private dashboardService: DashboardService,
    private webRTCService: WebRTCService
  ) {
    this.signalrService.connection.on('startLive', (user: UserInfo) =>
      this.roomService.lives.push(user)
    );
    this.signalrService.connection.on(
      'stopLive',
      (userId: number) =>
        (this.roomService.lives = this.roomService.lives.filter(
          l => l.id != userId
        ))
    );

    this.signalrService.connection.on(
      'offer',
      (userId: number, desc: string) => {
        if (this.localStream !== null)
          webRTCService.createAnswer(userId, desc, this.localStream);
      }
    );
    this.signalrService.connection.on(
      'answer',
      (userId: number, desc: string) => {
        webRTCService.acceptAnswer(userId, desc);
      }
    );

    this.signalrService.connection.on(
      'candidate',
      (userId: number, data: string) => {
        webRTCService.receiveCandidate(userId, data);
      }
    );
  }

  roomId: number;
  SPINNER = SPINNER.cubeGrid;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.ngxLoader.startLoader('loader-01');

      this.signalrService.invoke('leaveGroup');
      if (this.localStream) {
        this.closeLocalStream();
        this.signalrService.connection.invoke('stopLive');
        document.querySelector('.live .active').classList.remove('active');
      }
      this.chatService.messages = new Array<Message>();
      this.roomService.lives = new Array<UserInfo>();
      this.dashboardService.figures = new Array<Figure>();

      let roomId = +params.id;
      if (Number.isNaN(roomId)) this.router.navigateByUrl('/room');
      this.signalrService.invoke('joinGroup', roomId).then(res => {
        if (res) {
          forkJoin(
            this.dashboardService.getFigures(roomId),
            this.roomService.getLives(roomId),
            this.chatService.getChat(roomId)
          ).subscribe({
            complete: () => {
              this.roomId = roomId;
              this.ngxLoader.stopLoader('loader-01');
            }
          });
        } else this.router.navigateByUrl('/room');
      });
    });
  }

  localStream: MediaStream;

  closeLocalStream() {
    if (this.localStream != null) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
  }

  onLive(event) {
    let target = event.currentTarget as HTMLElement;
    if (target.classList.contains('active')) {
      if (this.localStream !== null) {
        this.signalrService.connection.invoke('stopLive');
        this.closeLocalStream();
      }
      target.classList.remove('active');
    } else {
      target.classList.add('show');
      let isVideo = target.id == 'live_video';
      if (isVideo) {
        target.nextElementSibling.classList.remove('active');
        target.nextElementSibling.classList.remove('show');
      } else {
        target.previousElementSibling.classList.remove('active');
        target.previousElementSibling.classList.remove('show');
      }
      this.webRTCService.getStream(isVideo).then(mediaStream => {
        if (this.localStream) {
          this.closeLocalStream();
          target.classList.add('active');
          this.localStream = mediaStream;
        } else {
          this.signalrService.connection
            .invoke('startLive', this.roomId)
            .then(res => {
              if (res) {
                target.classList.add('active');
                this.localStream = mediaStream;
              }
            });
        }
      });
    }
  }
}
