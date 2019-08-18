import { Component, OnInit } from '@angular/core';
import { FriendService } from 'src/app/shared/friend.service';
import { UserInfo } from 'src/app/models/userInfo.model';
import { environment } from 'src/environments/environment';
import { RoomService } from 'src/app/shared/room.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Room } from 'src/app/models/room.model';

@Component({
  selector: 'app-new-room',
  templateUrl: './new-room.component.html',
  styleUrls: ['./new-room.component.sass']
})
export class NewRoomComponent implements OnInit {
  constructor(
    private friendService: FriendService,
    private roomService: RoomService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  title = '';
  selectedImg = null;
  dropdownData = [];
  selectedItems = [];
  dropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 5,
    allowSearchFilter: true
  };

  get Environment() {
    return environment;
  }

  ngOnInit() {
    this.friendService.getFriendsSmallInfo().subscribe(
      (res: UserInfo[]) =>
        (this.dropdownData = res.map(user => {
          return { id: user.id, name: user.fname + ' ' + user.lname };
        }))
    );
  }

  changeAvatar(event) {
    let img = document.getElementById('imgAvatar') as HTMLImageElement;
    let label = document.getElementById('labelAvatar') as HTMLInputElement;
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => (img.src = e.target.result);
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImg = event.target.files[0];
      label.value = event.srcElement.value;
    } else {
      this.selectedImg = null;
      label.value = 'Choose file';
      img.src = environment.remoteUrl + '/default.jpg';
    }
  }

  onSubmit() {
    const participants: string[] = this.selectedItems.map(p => p.id);
    if (this.title === '') {
      //single chat
      if (this.selectedItems.length === 1) {
        //ok
        this.roomService.createRoom(null, participants, null)
        .subscribe(res => {
          this.roomService.getRooms().subscribe();
          this.router.navigateByUrl('/room/' + res);
        });
      }
    } else if (this.selectedItems.length > 0) {
      //group chat
      this.roomService
        .createRoom(this.title, participants, this.selectedImg)
        .subscribe(res => {
          this.roomService.getRooms().subscribe();
          this.router.navigateByUrl('/room/' + res);
        });
    }
    //error
  }
}
