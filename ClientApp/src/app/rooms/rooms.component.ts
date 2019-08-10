import { Component, OnInit } from '@angular/core';
import { RoomService } from '../shared/room.service';
import { Room } from '../models/room.model';
import { WebRTCService } from '../shared/web-rtc.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.sass']
})
export class RoomsComponent implements OnInit {
  constructor(private room: RoomService, private webrtc: WebRTCService) {}

  ngOnInit() {
    this.room.getRooms().subscribe(
      (res: Room[]) => this.rooms = res
    )
  }

  rooms: Room[];
  expended = false;
  expendedGroupMenu = false;
  expendedGroupLive = false;

  expandMenu() {
    let left_bar = document.getElementsByClassName('left_bar')[0] as HTMLElement;

    if (this.expended) 
      left_bar.style.flex = '0 0 50px';
    else
      left_bar.style.flex = '0 0 175px';

    this.expended = !this.expended;
  }

  expendGroupFigure(event){
    if(this.expendedGroupMenu){
      let el = document.getElementById('arcTool').nextElementSibling as HTMLElement;
      el.style.display = '';
      el = document.getElementById('lineTool').nextElementSibling as HTMLElement;
      el.style.display = '';
      el = document.getElementById('rectangleTool').nextElementSibling as HTMLElement;
      el.style.display = '';
      el = document.getElementById('paintTool').nextElementSibling as HTMLElement;
      el.style.display = '';
    }
    else{
      let el = document.getElementById('arcTool').nextElementSibling as HTMLElement;
      el.style.display = 'block';
      el = document.getElementById('lineTool').nextElementSibling as HTMLElement;
      el.style.display = 'block';
      el = document.getElementById('rectangleTool').nextElementSibling as HTMLElement;
      el.style.display = 'block';
      el = document.getElementById('paintTool').nextElementSibling as HTMLElement;
      el.style.display = 'block';
    }
    this.expendedGroupMenu = !this.expendedGroupMenu;
    return false;
  }

  expendGroupLive(event){
    if(this.expendedGroupLive){
      let el = document.getElementById('live_video') as HTMLElement;
      el.style.display = '';
      el = document.getElementById('live_audio') as HTMLElement;
      el.style.display = '';
    }
    else{
      let el = document.getElementById('live_video') as HTMLElement;
      el.style.display = 'block';
      el = document.getElementById('live_audio') as HTMLElement;
      el.style.display = 'block';
    }
    this.expendedGroupLive = !this.expendedGroupLive;
    return false;
  }

  onClickDocument() {
    if(this.expendedGroupMenu){
      let el = document.getElementById('arcTool').nextElementSibling as HTMLElement;
      el.style.display = '';
      el = document.getElementById('lineTool').nextElementSibling as HTMLElement;
      el.style.display = '';
      el = document.getElementById('rectangleTool').nextElementSibling as HTMLElement;
      el.style.display = '';
      el = document.getElementById('paintTool').nextElementSibling as HTMLElement;
      el.style.display = '';
      this.expendedGroupMenu = false;
    }
    if(this.expendedGroupLive){
      let el = document.getElementById('live_video') as HTMLElement;
      el.style.display = '';
      el = document.getElementById('live_audio') as HTMLElement;
      el.style.display = '';
      this.expendedGroupLive = false;
    }
  }

  connectToLive(userId: number){
    this.webrtc.createOffer(userId);
    return false;
  }
}
