import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.sass']
})
export class UserComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    if (localStorage.getItem('Token') !== null) {
      const dataToken = JSON.parse(window.atob(localStorage.getItem('Token').split('.')[1]));
      this.router.navigateByUrl('/profile/' + dataToken.UserId);
    }
  }

}
