import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { UserService } from "src/app/shared/user.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.sass"]
})
export class RegisterComponent implements OnInit {
  constructor(
    private account: UserService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {}

  onSubmit() {
    this.account.register().subscribe(
      (res: any) => {
        if (res.succeeded) {
          this.toastr.success("You are registered!", "Registration");
          this.account.registerFormModel.reset({ Sex: 0 });
          this.router.navigateByUrl("/login");
        } else {
          this.toastr.error(
            res.errors.map(err => err.description).join(" "),
            "Error!!!"
          );
        }
      },
      err => {
        const msgErrors = [];
        if (err.error.errors !== undefined) {
          for (let keyError in err.error.errors) {
            msgErrors.push(err.error.errors[keyError].join(" "));
          }
        }
        this.toastr.error(msgErrors.join(" "), "Error!!!");
      }
    );
  }
}
