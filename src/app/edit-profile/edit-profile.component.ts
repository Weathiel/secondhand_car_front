import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService } from '../services/alert.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../user';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  private form: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private authService: AuthenticationService,
              private router: Router,
              private alertService: AlertService) { }

  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      this.userService.getUserByUsername(user.username).subscribe((u: User) => {
        this.form = this.formBuilder.group({
          firstName: [u.firstName, Validators.nullValidator],
          lastName: [u.lastName, Validators.nullValidator],
          username: [u.username, Validators.nullValidator],
          password: [null, Validators.nullValidator],
          address: [u.address, Validators.nullValidator],
          // tslint:disable-next-line:max-line-length
          email: [u.email, [Validators.nullValidator, Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')]],
          city: [u.city, Validators.nullValidator],
          phoneNumber: [u.phoneNumber, [Validators.nullValidator, Validators.pattern('^[-\s\./0-9]*$')]]
        });
      });
    });
  }

  submit() {
    const newUser = new User();
    newUser.firstName = this.form.controls.firstName.value;
    newUser.firstName = this.form.controls.lastName.value;
    newUser.firstName = this.form.controls.username.value;
    newUser.firstName = this.form.controls.password.value;
    newUser.firstName = this.form.controls.address.value;
    newUser.firstName = this.form.controls.email.value;
    newUser.firstName = this.form.controls.city.value;
    newUser.phoneNumber = this.form.controls.phoneNumber.value;
    console.log(this.form.value);
    this.userService.update(this.authService.currentUserValue.userId, this.form.value).subscribe();
  }


}
