import { Component, OnInit } from '@angular/core';
import { RoomService } from '../shared/room.service';
import { WebRTCService } from '../shared/web-rtc.service';
import { environment } from 'src/environments/environment';
import { SignalrService } from '../shared/signalr.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.sass']
})
export class RoomsComponent implements OnInit {
  constructor(public roomService: RoomService, private webrtcService: WebRTCService, private signalRService: SignalrService) {}

  get Environment(){return environment}

  ngOnInit() {
    this.roomService.getRooms().subscribe();
    this.signalRService.connect();
  }

  expended = false;

  expandMenu() {
    let left_bar = document.getElementsByClassName('left_bar')[0] as HTMLElement;

    if (this.expended)
      left_bar.style.flex = '0 0 50px';
    else
      left_bar.style.flex = '0 0 175px';

    this.expended = !this.expended;
  }

  connectToLive(e, userId: number){
    e.preventDefault();
    this.webrtcService.createOffer(userId);
  }
}
