import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { MatIconModule } from '@angular/material';
import { User } from '../user';
import { AuthenticationService } from '../services/authentication.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { UserService } from '../services/user.service';
import { first, catchError, take } from 'rxjs/operators';
import { CurrencyService } from '../services/currency.service';
import { Currency } from '../currency';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  private loggedIn = false;
  private userRole: boolean;
  private currencies: Currency[];
  private currency: Currency;

  constructor(private route: ActivatedRoute,
              private iconRegistry: MatIconRegistry,
              private sanitizer: DomSanitizer,
              private authService: AuthenticationService,
              private userService: UserService,
              private currencyService: CurrencyService) {
    this.authService.currentUser.subscribe(data => {
      this.loggedIn = !!data;
      if ( !!data ) {
        this.userRole = false;
        data.role.forEach(rol => {
            if (rol === 'ROLE_WORKER') {
             this.userRole = true;
            }
        });

      } else {
        this.userRole = null;
      }
    });

  }

  ngOnInit() {
  }

  logout() {
    this.authService.logout();
    this.userRole = null;
  }

  onCurrencyChange(cur) {
    this.currencyService.getCurr().next(cur.value);
  }
}
