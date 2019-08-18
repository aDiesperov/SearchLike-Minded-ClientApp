import { Component, OnInit } from '@angular/core';
import { UserCard } from 'src/app/models/userCard.model';
import { FriendService } from 'src/app/shared/friend.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.sass']
})
export class FriendListComponent implements OnInit {
  constructor(private friendService: FriendService, private route: ActivatedRoute) {}

  users: UserCard[];
  newFollowers: UserCard[];

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.users = [];
      this.newFollowers = [];
      switch (params.type) {
        case 'online':
            this.friendService.getOnline().subscribe((res: UserCard[]) => {
              this.users = res.filter(u => !u.new);
              this.newFollowers = res.filter(u => u.new);
            });
          break;
        case 'followers':
          this.friendService.getFollowers().subscribe((res: UserCard[]) => {
            this.users = res.filter(u => !u.new);
            this.newFollowers = res.filter(u => u.new);
          });
          break;
        case 'all':
        default:
          this.friendService.getFriends()
            .subscribe((res: UserCard[]) => (this.users = res));
          break;
      }
    });
  }
}
