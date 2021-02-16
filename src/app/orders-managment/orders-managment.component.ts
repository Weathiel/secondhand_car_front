import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, PageEvent, MatDialogRef, MatTableDataSource, Sort, MAT_DIALOG_DATA } from '@angular/material';
import { first } from 'rxjs/operators';
import { ManagementDialogComponent } from '../management-dialog/management-dialog.component';
import { Orders } from '../orders';
import { OrdersService } from '../services/orders.service';
import { OffersService } from '../services/offers.service';
import { UserService } from '../services/user.service';
import { AuthenticationService } from '../services/authentication.service';
import { OrderFilter } from '../orderFilter';

@Component({
  selector: 'app-orders-managment',
  templateUrl: './orders-managment.component.html',
  styleUrls: ['./orders-managment.component.css']
})
export class OrdersManagmentComponent implements OnInit {
  dataSource: MatTableDataSource<Orders>;
  orders: Orders[];
  displayedColumns: string[] = ['username', 'vin', 'totalPrice',
   'discount', 'contract.done', 'contract.deposit', 'createdDate', 'details', 'delete'];
  pageSize = 10;
  pageIndex = 0;
  length: number;
  sortBy = 'orderId';
  sortOrder = 'asc';
  pageSizeOptions: number[] = [ 10, 1, 30 ];
  isWorker = false;
  role = false;

  constructor(private ordersService: OrdersService,
              private offersService: OffersService,
              private authService: AuthenticationService,
              public dialog: MatDialog) {
                authService.currentUser.subscribe(data => {
                  data.role.forEach(role => {
                    if (role === 'ROLE_ADMIN' || role === 'ROLE_WORKER') {
                      this.role = true;
                      this.displayedColumns = ['username', 'vin', 'totalPrice',
   'discount', 'contract.done', 'contract.deposit', 'createdDate', 'details', 'edit', 'delete'];
                    }
                  });
                });
   }


  ngOnInit() {
    this.ordersService.getAll(this.pageIndex, this.pageSize, this.sortBy, this.sortOrder).subscribe(data => {
      this.orders = data;
      this.dataSource = new MatTableDataSource(this.orders);
    });
    this.ordersService.getLenght().subscribe((data: number) => {
      this.length = data;
    });
  }

  details(id) {
    const dialogRef = this.dialog.open(DetailsOrdersDialogComponent, {
      width: '800px',
      data: {orderId: id}
    });
  }

  filter() {
      // tslint:disable-next-line:max-line-length
      this.offersService.getLenght().subscribe(length => this.ordersService.getAll(0, length, `orderId`, `ASC`).subscribe(allOrders => {
        const dialogRef = this.dialog.open(FilterOrdersDialogComponent, {
          width: '500px',
          data: {orders: allOrders}
        });
        dialogRef.afterClosed().pipe(first()).subscribe(data => {
          this.ordersService.filter(data).subscribe((or: Orders[]) => {
            this.orders = or;
            this.dataSource = new MatTableDataSource(this.orders);
          });
        });
      }));

  }

  sort(sort: Sort) {
    if (sort.direction != null) {
      this.sortOrder = sort.direction;
      this.sortBy = sort.active;
    }
    // tslint:disable-next-line:max-line-length
    this.ordersService.getAll(this.pageIndex, this.pageSize, this.sortBy, this.sortOrder).subscribe(data => this.dataSource.data = data);
  }


  changePage(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.ordersService.getAll(event.pageIndex, event.pageSize, this.sortBy, this.sortOrder).subscribe(data => {
      this.dataSource.data = data;
    });
  }

  edit(id) {
    const dialogRef = this.dialog.open(EditOrdersDialogComponent, {
      width: '350px'
    });
    dialogRef.afterClosed().pipe(first()).subscribe(role => {
      const order = this.orders.find(ele => ele.orderId === id);
      order.offers.price += (order.offers.price * (0.01 * order.discount));
      order.discount = role.discount;
      order.contract.done = role.done;
      order.contract.deposit += order.contract.deposit;
      if (order.contract.done) {
        order.offers.archivized = true;
        this.offersService.update(order.offers.offerId, order.offers).pipe(first()).subscribe();
      }
      this.ordersService.update(id, order).pipe(first()).subscribe();
    });
  }

  delete(id) {
    const dialogRef = this.dialog.open(ManagementDialogComponent, {
      width: '350px',
      data: {data: false}
    });

    dialogRef.afterClosed().pipe(first()).subscribe((data: boolean) => {
      if (data === true) {
        this.ordersService.delete(id).subscribe(() => {
          this.ngOnInit();
        });
      }
    });
  }

}

@Component({
  selector: 'app-orders-management-dialog',
  templateUrl: 'edit-orders-dialog.html'
})
export class EditOrdersDialogComponent {
  private discount: number;
  private done: boolean;
  private deposit: number;
  constructor(
    public dialogRef: MatDialogRef<EditOrdersDialogComponent>) {
    }

    onClick(): void {
      const result = {done: this.done, discount: this.discount, deposit: this.deposit};
      this.dialogRef.close(result);
    }

}

@Component({
  selector: 'app-orders-management-dialog',
  templateUrl: 'details-orders-dialog.html'
})
export class DetailsOrdersDialogComponent {
  orders: Orders[] = [];
  image: string;
  constructor(
    public dialogRef: MatDialogRef<EditOrdersDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public ordersService: OrdersService) {
      this.ordersService.getOne(this.data.orderId).subscribe((order: Orders) => {
        this.orders.push(order);
        this.image = order.offers.image;
      });
    }

    onClick(): void {
      this.dialogRef.close();
    }

}

@Component({
  selector: 'app-offer-managment-filter-dialog',
  templateUrl: 'filter-order-dialog.html',
  styleUrls: ['./orders-managment.component.css']
})

export class FilterOrdersDialogComponent {
  // tslint:disable-next-line:variable-name
  usernames: string;
  done: boolean;
  minDiscount: number;
  maxDiscount: number;
  minValue: number;
  maxValue: number;
  vin: string;

  constructor(
    public dialogRef: MatDialogRef<FilterOrdersDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public ordersService: OrdersService) {
    }

    onClick(): void {
      const orderFilter = new OrderFilter();

      orderFilter.maxValue = this.maxValue;

      orderFilter.minValue = this.minValue;

      orderFilter.minDiscount = this.minDiscount;

      orderFilter.maxDiscount = this.maxDiscount;

      orderFilter.vin = this.vin;

      orderFilter.username = this.usernames;
      if (this.maxDiscount == null) {
        orderFilter.maxDiscount = 1000000;
      }
      if (this.vin == null) {
        orderFilter.vin = '';
      }
      if (this.usernames == null) {
        orderFilter.username = '';
      }
      if (this.minDiscount == null) {
        orderFilter.minDiscount = 0;
      }
      if (this.minValue == null) {
        orderFilter.minValue = 0;
      }
      if (this.maxValue == null) {
        orderFilter.maxValue = 1000000;
      }
      this.dialogRef.close(orderFilter);


    }

}
