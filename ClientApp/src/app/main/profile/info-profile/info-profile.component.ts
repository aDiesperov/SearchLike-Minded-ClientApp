import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/user.service';
import { ProfileInfo } from 'src/app/models/profileInfo.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-info-profile',
  templateUrl: './info-profile.component.html',
  styleUrls: ['./info-profile.component.sass']
})
export class InfoProfileComponent implements OnInit, OnChanges {
  
  get Environment(){return environment}

  constructor(private service: UserService, private router: Router) {
    this.UserId = +JSON.parse(
      window.atob(localStorage.getItem('Token').split('.')[1])
    ).UserId;
  }

  @Input() profileId: number;

  profileInfo: ProfileInfo;
  UserId: number;
  selectedImg = false;

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.service.getProfile(this.profileId).subscribe(
      (res: ProfileInfo) => {
        this.profileInfo = res;
        this.profileInfo.birthday = new Date(this.profileInfo.birthday).toLocaleDateString();
        this.profileInfo.registrationDate = new Date(this.profileInfo.registrationDate).toLocaleString();
      },
      err => {
        if (err.status === 404) {
          this.router.navigateByUrl('/profile/' + this.UserId);
        }
      }
    );
  }

  changeLabelAvatar(event){
    let imgElement = document.getElementById('imgAvatar') as HTMLImageElement;
    let imgLabel = document.getElementById('labelAvatar');
    
    if(event.target.files && event.target.files[0]){
      const reader = new FileReader();
      reader.onload = (e: any) => imgElement.src = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      imgLabel.innerText = event.srcElement.value;
      this.selectedImg = true;
    }    
    else{
      imgLabel.innerText = 'Choose file';
      imgElement.src = environment.remoteUrl + '/' + this.profileInfo.avatar;
      this.selectedImg = false;

    }
  }

  uploadAvatar(){
    let inpAvatar:any = document.getElementById('inputAvatar');
    if(inpAvatar.files && inpAvatar.files[0]){
      const fd = new FormData();
      fd.append('file', inpAvatar.files[0]);
      this.service.updateAvatar(fd).subscribe(
        res => window.location.reload()
      )
    }
  }
}
