import { Component, OnInit } from '@angular/core';
import { RoomService } from '../shared/room.service';
import { Room } from '../models/room.model';
import { WebRTCService } from '../shared/web-rtc.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.sass']
})
export class RoomsComponent implements OnInit {
  constructor(private roomService: RoomService, private webrtc: WebRTCService) {}

  get Environment(){return environment}

  ngOnInit() {
    this.roomService.getRooms().subscribe();
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
    this.webrtc.createOffer(userId);
  }
}
