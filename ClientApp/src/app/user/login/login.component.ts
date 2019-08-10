import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  constructor(private account: UserService, private toastr: ToastrService, private router: Router) { }

  loginModel = {
    Email: '',
    Password: '',
    RememberMe: false
  };

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    this.account.login({ Email: form.value.Email, Password: form.value.Password }).subscribe((res: any) => {
      localStorage.setItem('Token', res.token);
      const dataToken = JSON.parse(window.atob(res.token.split('.')[1]));
      this.router.navigateByUrl('/profile/' + dataToken.UserId);
    }, err => {
      const msgErrors = [];
      if (err.error.errors !== undefined) {
        for (let keyError in err.error.errors) {
          msgErrors.push(err.error.errors[keyError].join(' '));
        }
      }
      this.toastr.error(msgErrors.join(' '), 'Error!!!');
    });
  }

}
