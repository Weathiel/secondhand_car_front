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
    this.form = this.formBuilder.group({
          usernames: [null, Validators.nullValidator],
          password: [null, Validators.nullValidator],
          firstName: [null, Validators.nullValidator],
          lastName: [null, Validators.nullValidator],
          address: [null, Validators.nullValidator],
          // tslint:disable-next-line:max-line-length
          email: [null, [Validators.nullValidator, Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')]],
          city: [null, Validators.nullValidator],
          phoneNumber: [null, [Validators.nullValidator, Validators.pattern('^[-\s\./0-9]*$')]]
    });
    this.authService.currentUser.subscribe(user => {
      this.userService.getUserByUsername(user.username).subscribe((u: User) => {
        this.form = this.formBuilder.group({
          usernames: [user.username, Validators.nullValidator],
          password: [null, Validators.nullValidator],
          firstName: [u.firstName, Validators.nullValidator],
          lastName: [u.lastName, Validators.nullValidator],
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
    newUser.lastName = this.form.controls.lastName.value;
    newUser.username = this.form.controls.usernames.value;
    newUser.password = this.form.controls.password.value;
    if (newUser.password == null) {
      newUser.password = '';
    }
    newUser.address = this.form.controls.address.value;
    newUser.email = this.form.controls.email.value;
    newUser.city = this.form.controls.city.value;
    newUser.phoneNumber = this.form.controls.phoneNumber.value;
    console.log(this.form.value);
    this.authService.currentUser.subscribe((u: User) => {
      this.userService.update(u.username, this.form.value).subscribe(() => {
        this.authService.currentUser.subscribe(user => {
          user.username = newUser.username;
        });
      });
    });
  }


}
