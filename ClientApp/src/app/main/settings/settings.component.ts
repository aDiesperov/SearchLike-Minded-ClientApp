import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';
import { Settings } from 'src/app/models/settings.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.sass']
})
export class SettingsComponent implements OnInit {

  constructor(private service: UserService, private router: Router) { 
    service.getSettings().subscribe(
      (res: Settings) => {
        res.birthday = new Date(res.birthday).toISOString().split('T')[0];
        service.settingsFormModel.setValue(res);
      }
    )
  }

  ngOnInit() {
  }

  onSubmit(){
    this.service.setSettings().subscribe(
      res => this.router.navigateByUrl('/')
    )
  }

}
