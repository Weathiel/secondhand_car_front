import { Car } from './car';

export class OfferFilter {
    car: Car;
    vin: string;
    minMilleage: number;
    maxMilleage: number;
    minValue: number;
    maxValue: number;
    englishCar: boolean;
    // tslint:disable-next-line:variable-name
    prod_country: string;
    date: string;
    maxDate: string;
    offer: any;
}
