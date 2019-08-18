import { Component, OnInit, Input } from '@angular/core';
import { UserCard } from 'src/app/models/userCard.model';
import { FriendService } from 'src/app/shared/friend.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-friend-item',
  templateUrl: './friend-item.component.html',
  styleUrls: ['./friend-item.component.sass']
})
export class FriendItemComponent implements OnInit {
  constructor(private service: FriendService) {}

  get Environment() {
    return environment;
  }

  @Input() user: UserCard;

  ngOnInit() {}

  onFriend() {
    this.service
      .addFriend(this.user.id)
      .subscribe((res: any) => (this.user.typeFriend = res.follower ? 1 : 2));
    return false;
  }

  onUnfriend() {
    this.service
      .delFriend(this.user.id)
      .subscribe(res => (this.user.typeFriend = 0));
    return false;
  }

  onUnfollow() {
    this.service
      .unfollow(this.user.id)
      .subscribe(res => (this.user.typeFriend = 0));
    return false;
  }
}
