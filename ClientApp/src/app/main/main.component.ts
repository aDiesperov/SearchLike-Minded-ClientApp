import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../shared/user.service';
import { MyInfo } from '../models/myInfo.model';
import { SignalrService } from '../shared/signalr.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass']
})
export class MainComponent implements OnInit {

  get Environment(){return environment}
  
  constructor(private router: Router, userService: UserService, private signalrService: SignalrService) {
    this.UserId = +JSON.parse(
      window.atob(localStorage.getItem('Token').split('.')[1])
    ).UserId;

    userService.getMyInfo().subscribe(
      (res: MyInfo) => {
        this.myInfo = res;
        localStorage.setItem('avatar', res.avatar);
      },
      err => {
        if (err.status === 404) {
          localStorage.clear();
          this.router.navigateByUrl('/login');
        }
      }
    );
  }

  myInfo: MyInfo;
  UserId: number;
  textSearch: string;

  ngOnInit() {}

  ngDoCheck(): void {
    if (
      this.myInfo !== undefined &&
      this.myInfo.newFollowers > 0 &&
      this.router.url.indexOf('followers') > 0
    ) {
      this.myInfo.newFollowers = 0;
    }
  }

  onSearch() {
    if (this.textSearch.length >= 2) {
      this.router.navigateByUrl('search?q=' + this.textSearch);
    }
  }

  onExit() {
    localStorage.clear();
    this.router.navigateByUrl('/login');
    return false;
  }
}
