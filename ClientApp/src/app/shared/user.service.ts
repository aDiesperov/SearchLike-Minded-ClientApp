import { Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Settings } from '../models/settings.model';
import { tap } from 'rxjs/operators';
import { MyInfo } from '../models/myInfo.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private fb: FormBuilder, private http: HttpClient) {}

  registerFormModel = this.fb.group({
    Fname: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(30)]
    ],
    Lname: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(30)]
    ],
    Mname: [null, [Validators.minLength(2), Validators.maxLength(30)]],
    Birthday: ['', Validators.required],
    Sex: [0, Validators.required],
    Email: ['', [Validators.required, Validators.email]],
    Passwords: this.fb.group(
      {
        Password: [
          '',
          [
            Validators.required,
            Validators.pattern('.*[a-z]+.*'),
            Validators.minLength(5),
            Validators.maxLength(20)
          ]
        ],
        PasswordConfirm: [
          '',
          [
            Validators.required
          ]
        ]
      },
      { validator: this.comparePasswords }
    )
  });

  settingsFormModel = this.fb.group({
    fname: ['', [Validators.required, Validators.maxLength(30), Validators.minLength(2)]],
    mname: ['', [Validators.maxLength(30), Validators.minLength(2)]],
    lname: ['', [Validators.required, Validators.maxLength(30), Validators.minLength(2)]],
    hometown: ['', [Validators.maxLength(30), Validators.minLength(3)]],
    currentCity: ['', [Validators.maxLength(30), Validators.minLength(3)]],
    birthday: ['', Validators.required],
    institution: ['', [Validators.maxLength(20), Validators.minLength(3)]],
    sex: [0, Validators.required],
    webSite: ['', [Validators.maxLength(30), Validators.minLength(5)]],
    aboutMe: ['', [Validators.maxLength(200), Validators.minLength(2)]],
    phoneNumber: ['', Validators.minLength(10)]
  })

  comparePasswords(fb: FormGroup) {
    const confirmPass = fb.get('PasswordConfirm');
    const pass = fb.get('Password');
    if (pass.errors == null || 'passMismatch' in confirmPass.errors) {
      if (pass.value !== confirmPass.value) {
        confirmPass.setErrors({ passMismatch: true });
      } else {
        confirmPass.setErrors(null);
      }
    }
  }

  register() {
    const body = {
      Fname: this.registerFormModel.value.Fname,
      Lname: this.registerFormModel.value.Lname,
      Mname: this.registerFormModel.value.Mname,
      Sex: this.registerFormModel.value.Sex,
      Birthday: this.registerFormModel.value.Birthday,
      Email: this.registerFormModel.value.Email,
      Password: this.registerFormModel.value.Passwords.Password
    };
    return this.http.post(environment.remoteUrl_api + '/user/register', body);
  }

  login(formData) {
    return this.http.post(environment.remoteUrl_api + '/user/login', formData);
  }

  getProfile(id: number) {
    return this.http.get(environment.remoteUrl_api + '/user/' + id);
  }

  myInfo: MyInfo;

  getMyInfo() {
    return this.http.get(environment.remoteUrl_api + '/user/getMyInfo').pipe(
      tap((res: MyInfo) => {
        this.myInfo = res;
      })
    );
  }

  updateAvatar(fd) {
    return this.http.put(environment.remoteUrl_api + '/user/updateAvatar', fd);
  }

  getSettings() {
    return this.http.get(environment.remoteUrl_api + '/user/getSettings').subscribe(
      (res: Settings) => {
        res.birthday = new Date(res.birthday).toISOString().split('T')[0];
        this.settingsFormModel.setValue(res);
      }
    );
  }

  setSettings(): boolean {
    if(this.settingsFormModel.valid){
      this.http.put(environment.remoteUrl_api + '/user/setSettings', this.settingsFormModel.value)
        .subscribe();
      return true;
    }
    return false;
  }
}
