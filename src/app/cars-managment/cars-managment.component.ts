import { Component, OnInit, Inject } from '@angular/core';
import { Sort, MatTableDataSource, MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { first } from 'rxjs/operators';
import { Offer } from '../offer';
import { CarsService } from '../services/cars.service';
import { Car } from '../car';
import { FilterOfferDialogComponent } from '../offer-managment/offer-managment.component';
import { OffersService } from '../services/offers.service';

@Component({
  selector: 'app-cars-managment',
  templateUrl: './cars-managment.component.html',
  styleUrls: ['./cars-managment.component.css']
})
export class CarsManagmentComponent implements OnInit {
  cars: Car[];
  displayedColumns: string[] = ['brand', 'model',
   'body_type', 'gas_type', 'engine_power', 'edit', 'delete'];
  pageIndex = 0;
  pageSize = 10;
  length: number;
  pageSizeOptions: number[] = [ 10, 1, 30 ];
  sortBy = 'carId';
  offers: Car[];
  sortOrder = 'asc';
  dataSource: MatTableDataSource<Car>;
  constructor(private carsService: CarsService,
              private offersService: OffersService,
              public dialog: MatDialog) {
                this.carsService.getAll().subscribe(ca => {
                  this.dataSource = new MatTableDataSource(ca);
                });
              }

  ngOnInit() {
    this.carsService.getLenght().subscribe(nes => this.length = nes);
  }

  filter() {
    this.carsService.getAll().pipe().subscribe(car => {
        const dialogRef = this.dialog.open(FilterCarsDialogComponent, {
          width: '500px',
          data: {cars: car}
        });

        dialogRef.afterClosed().pipe(first()).subscribe(data => {
          if (data != null) {
            this.offers = data;
            this.dataSource = new MatTableDataSource(this.offers);
            this.length = data.length;
          }
        });
    });

  }

  delete(id) {
    this.carsService.delete(id).subscribe(() => {
      this.carsService.getAll().subscribe(ca => {
        this.offers = ca;
        this.dataSource = new MatTableDataSource(ca);
        this.length = ca.length;
      });
    });
  }

  edit(id) {
    const dialogRef = this.dialog.open(CreateCarsDialogComponent, {
      width: '500px',
      data: {carId: id}
    });

    dialogRef.afterClosed().pipe(first()).subscribe((off: Car) => {
      if (off != null) {
        this.carsService.update(id, off).subscribe((dataCar: Car) => {
          this.carsService.getAll().subscribe(dataAll => {
            this.offers = dataAll;
            this.dataSource = new MatTableDataSource(this.offers);
            this.length = dataAll.length;
          });
        });
      }
    });
  }

  sort(sort: Sort) {
    if (sort.direction !== null) {
      this.sortOrder = sort.direction;
      this.sortBy = sort.active;
      this.carsService.getAll().subscribe(data => this.dataSource.data = data);
    }
  }

  create() {

      const dialogRef = this.dialog.open(CreateCarsDialogComponent, {
        width: '500px',
        data: {}
      });

      dialogRef.afterClosed().pipe(first()).subscribe((off: Car) => {
        if (off != null) {
          this.carsService.create(off).subscribe((dataCar: Car) => {
            this.carsService.getAll().subscribe(dataAll => {
              this.offers = dataAll;
              this.dataSource = new MatTableDataSource(this.offers);
              this.length = dataAll.length;
            });
          });

        }

    });
  }

}

@Component({
  selector: 'app-cars-managment-dialog',
  templateUrl: 'create-cars-dialog.html'
})
export class CreateCarsDialogComponent {
  private model: string;
  private brand: string;
  // tslint:disable-next-line:variable-name
  private gas_type: string;
  // tslint:disable-next-line:variable-name
  private body_type: string;
  // tslint:disable-next-line:variable-name
  private engine_power: number;
  public date: Date;
  public endDate: Date;

  constructor(
    public dialogRef: MatDialogRef<CreateCarsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public carsService: CarsService) {
      console.log(data.carId);
      if (data.carId != null) {
        carsService.getOne(data.carId).subscribe((car: Car) => {
          this.model = car.model;
          this.brand = car.brand;
          this.gas_type = car.gas_type;
          this.body_type = car.body_type;
          this.engine_power = car.engine_power;
          this.date = car.s_production_year;
          this.endDate = car.e_production_year;
        });
      }
    }

    onClick(): void {
      const c = new Car();
      c.body_type = this.body_type;
      c.brand = this.brand;
      c.engine_power = this.engine_power;
      c.gas_type = this.gas_type;
      c.model = this.model;
      c.e_production_year = this.endDate;
      c.s_production_year = this.date;
      console.log(c);
      this.dialogRef.close(c);
    }

}

@Component({
  selector: 'app-cars-managment-filter-dialog',
  templateUrl: 'filter-cars-dialog.html'
})

export class FilterCarsDialogComponent {
  newCars: Car = new Car();
  // tslint:disable-next-line:variable-name
  prod_country: string;
  englishCar: boolean;
  minMilleage: number;
  maxMilleage: number;

  selectBrand(brand) {
    return this.data.cars.filter(elementbrand => elementbrand.brand === brand);
  }

  selectModel(model) {
    return this.data.cars.filter(elementmodel => elementmodel.model === model);
  }

  constructor(
    public dialogRef: MatDialogRef<FilterCarsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    onClick(): void {

      const foundCar = this.data.cars.filter(searchCar => {
        if ( (searchCar.brand === this.newCars.brand || this.newCars.brand == null)
          && (searchCar.model === this.newCars.model || this.newCars.model == null)
          && (searchCar.gas_type === this.newCars.gas_type || this.newCars.gas_type == null)
          && (searchCar.body_type === this.newCars.body_type || this.newCars.gas_type == null)) {
            return searchCar;
          }
     });

      this.dialogRef.close(foundCar);
    }

}
