import { Component, OnInit, NgModuleRef, PlatformRef, ContentChild, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../shared/user.service';
import { MyInfo } from '../models/myInfo.model';
import { SignalrService } from '../shared/signalr.service';
import { environment } from 'src/environments/environment';
import { RoomService } from '../shared/room.service';
import { FriendListComponent } from './friend-list/friend-list.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass']
})
export class MainComponent implements OnInit {
  get Environment() {
    return environment;
  }

  constructor(
    private router: Router,
    public userService: UserService,
    private signalrService: SignalrService,
    public roomService: RoomService
  ) {
    this.UserId = +JSON.parse(
      window.atob(localStorage.getItem('Token').split('.')[1])
    ).UserId;

    this.userService.getMyInfo().subscribe(
      res => {},
      err => {
        if (err.status === 404) {
          localStorage.clear();
          this.router.navigateByUrl('/login');
        }
      }
    );

    this.roomService.getRooms().subscribe();
  }

  UserId: number;
  textSearch: string;

  ngOnInit() {
    this.signalrService.connect();
  }

  ngDoCheck(): void {
    if (
      this.userService.myInfo !== undefined &&
      this.userService.myInfo.newFollowers > 0 &&
      this.router.url.indexOf('followers') > 0
    ) {
      this.userService.myInfo.newFollowers = 0;
    }
  }

  onSearch() {
    if (this.textSearch.length >= 2) {
      this.router.navigateByUrl('search?q=' + this.textSearch);
    }
  }

  onExit() {
    localStorage.clear();
    this.signalrService.Connection = null;
    this.router.navigateByUrl('/login');
    return false;
  }
}
