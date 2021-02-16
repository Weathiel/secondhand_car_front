import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Offer } from '../offer';
import { OffersService } from '../services/offers.service';
import { PageEvent, MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatTableDataSource } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Car } from '../car';
import { FilterOfferDialogComponent } from '../offer-managment/offer-managment.component';
import { CarsService } from '../services/cars.service';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';
import { Orders } from '../orders';
import { OrdersService } from '../services/orders.service';
import { Contract } from '../contract';
import { NavbarComponent } from '../navbar/navbar.component';
import { Currency } from '../currency';
import { CurrencyService } from '../services/currency.service';
import { OfferDetailsComponent } from '../offer-details/offer-details.component';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private offers: Offer[];
  pageIndex = 0;
  pageSize = 4;
  length: number;
  userRole: boolean;
  users: number;
  loggedIn: boolean;
  currency: Currency;
  dataSource: MatTableDataSource<Offer>;
  constructor(private offersService: OffersService,
              private carsService: CarsService,
              private ordersService: OrdersService,
              public dialog: MatDialog,
              private authService: AuthenticationService,
              private currencyService: CurrencyService,
              private router: Router,
              private route: ActivatedRoute) {
                this.authService.currentUser.subscribe(data => {
                  this.loggedIn = !!data;
                  if ( !!data ) {
                    this.users = data.userId;
                    if (data.role[0] !== 'ROLE_USER') {
                      this.userRole = true;
                    } else {
                      this.userRole = false;
                    }
                  } else {
                    this.userRole = false;
                  }
                });
                this.offersService.getAll(this.pageIndex, this.pageSize, 'createdBy', 'asc').subscribe(data => {
                  const cur: Currency = JSON.parse(localStorage.getItem('currency'));
                  this.offers = data;
                  this.offers = this.offers.filter(cafil => {
                    if (cafil.archivized === false) {
                      return cafil;
                    }
                  });
                  this.offers.every(ca => ca.priceBack = ca.price);
                  this.currencyService.getCurr().subscribe(curVal => {
                    this.offers.every(datCur => {
                      datCur.price = datCur.priceBack / curVal.exchange_rate;
                    });
                   });
                  });
              }

  ngOnInit() {
    this.offersService.getLenght().subscribe((data: number) => {
      this.length = data;
    });
  }

  changePage(event: PageEvent) {
    this.offersService.getAll(event.pageIndex, event.pageSize, 'createdBy', 'asc').subscribe(data => {
      this.offers = data;
    });
  }

  order(offer: Offer) {
    const newOrder = new Orders();
    const newContract = new Contract();
    newOrder.discount = 0;
    newOrder.offerId = offer.offerId;
    newOrder.userId = this.authService.currentUserValue.userId;
    newContract.done = false;
    newContract.deposit = 0;
    newOrder.contract = newContract;
    this.ordersService.new(newOrder).subscribe();
  }

  filter() {
    this.carsService.getAll().pipe().subscribe(car => {
      this.offersService.getLenght().subscribe(length => this.offersService.getAll(0, length, `offerId`, `asc`).subscribe(allOffers => {
        const dialogRef = this.dialog.open(HomeFilterOfferDialogComponent, {
          width: '500px',
          data: {cars: car, offers: allOffers}
        });
        dialogRef.afterClosed().pipe(first()).subscribe(data => {
          for (let i = 0; i < 4 ; i++) {
            if (data[i] != null) {
              this.offers[i] = data[i];
            } else {
              this.offers.pop();
            }
          }
          this.length = data.length;
        });
      }));
    });

  }

  details(id: Offer) {
    this.offersService.offerId = id.offerId;
    console.log(id);
    this.router.navigate(['offerDetail']);
  }

}

@Component({
  selector: 'app-home-managment-filter-dialog',
  templateUrl: 'home-filter-dialog.html'
})

export class HomeFilterOfferDialogComponent {
  newCars: Car = new Car();
  newOffers: Offer = new Offer();
  minValue: number;
  maxValue: number;
  date = new FormControl(new Date(1970, 1, 1));
  maxDate = new FormControl(new Date());
  color: string;
  // tslint:disable-next-line:variable-name
  prod_country: string;
  englishCar: boolean;
  minMilleage: number;
  maxMilleage: number;

  constructor(
    public dialogRef: MatDialogRef<FilterOfferDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    selectBrand(brand) {
      return this.data.cars.filter(elementbrand => elementbrand.brand === brand);
    }

    selectModel(model) {
      return this.data.cars.filter(elementmodel => elementmodel.model === model);
    }

    selectColor(color) {
      return this.data.offers.filter(elementcolor => elementcolor.color === color);
    }


    onClick(): void {
       const foundCar = this.data.cars.find(searchCar => {
         if (searchCar.brand === this.newCars.brand
           && searchCar.model === this.newCars.model
           && searchCar.gas_type === this.newCars.gas_type
           && searchCar.body_type === this.newCars.body_type) {
             return searchCar;
           }
      });



       const offer = this.data.offers.filter((searchOffer: Offer) => {

        if (this.minMilleage == null || searchOffer.mileage >= this.minMilleage) {
          if (this.maxMilleage == null || searchOffer.mileage <= this.maxMilleage) {
            if (this.minValue == null || searchOffer.price >= this.minValue) {
              if (this.maxValue == null || searchOffer.price <= this.maxValue) {
                if (foundCar == null || foundCar.carId === searchOffer.cars.carId) {
                  if (this.englishCar == null || this.englishCar === searchOffer.englishCar) {
                    if (this.prod_country == null || this.prod_country === searchOffer.prod_country) {
                      if (searchOffer.production_date == null) {
                        return searchOffer;
                      }
                      const prodDate = new Date(searchOffer.production_date);
                      // console.log(prodDate);
                      if (this.date.value == null || this.date.value <= prodDate) {
                        if (this.maxDate.value == null || this.maxDate.value >= prodDate) {
                          return searchOffer;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
    });

       this.dialogRef.close(offer);
    }

}
