import { Component, OnInit } from '@angular/core';
import { Offer } from '../offer';
import { Orders } from '../orders';
import { Contract } from '../contract';
import { AuthenticationService } from '../services/authentication.service';
import { OrdersService } from '../services/orders.service';
import { PageEvent, MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatTableDataSource } from '@angular/material';
import { FormControl } from '@angular/forms';
import { OffersService } from '../services/offers.service';

@Component({
  selector: 'app-offer-details',
  templateUrl: './offer-details.component.html',
  styleUrls: ['./offer-details.component.css']
})
export class OfferDetailsComponent implements OnInit {

  offers: Offer[] = [];
  queue: number;
  vin: string;
  loggedIn: boolean;
  constructor(private authService: AuthenticationService,
              private ordersService: OrdersService,
              private offersService: OffersService) {
                this.authService.currentUser.subscribe(data => {
                  this.loggedIn = !!data;
                });

                this.offersService.getOne(this.offersService.offerId).subscribe((data: Offer) => {
                  this.offers = [];
                  this.offers.push(data);
                  this.vin = data.vin;
                  this.offersService.getQueue(data.vin).subscribe((queueNum: number) => {
                    this.queue = queueNum;
                  });
                });

               }

  ngOnInit() {

  }


  order(offer: Offer) {
    this.authService.currentUser.subscribe(data => {
      const newOrder = new Orders();
      const newContract = new Contract();
      newOrder.discount = 0;
      newOrder.offerId = offer.offerId;
      newOrder.username = data.username;
      console.log(newOrder.username);
      newContract.done = false;
      newContract.deposit = 0;
      newOrder.contract = newContract;
      this.ordersService.new(newOrder).subscribe(() => {
        this.offersService.getQueue(this.vin).subscribe((queueNum: number) => {
          this.queue = queueNum;
        });
      });
    });

  }
}
