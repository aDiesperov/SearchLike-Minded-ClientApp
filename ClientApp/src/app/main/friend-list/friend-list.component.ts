import { Component, OnInit } from '@angular/core';
import { UserCard } from 'src/app/models/userCard.model';
import { FriendService } from 'src/app/shared/friend.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.sass']
})
export class FriendListComponent implements OnInit {
  constructor(private friendService: FriendService, private route: ActivatedRoute, public userService: UserService) {}

  users: UserCard[];

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.users = [];
      switch (params.type) {
        case 'online':
          this.friendService.getOnline().subscribe((res: UserCard[]) => this.users = res);
          break;
        case 'followers':
          this.friendService.getFollowers().subscribe((res: UserCard[]) => this.users = res);
          break;
        case 'all':
        default:
          this.friendService.getFriends().subscribe((res: UserCard[]) => this.users = res);
          break;
      }
    });
  }
}
