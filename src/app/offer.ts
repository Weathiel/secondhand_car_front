import { Car } from './car';

// tslint:disable:variable-name
export class Offer {
    offerId: number;
    vin: string;
    mileage: number;
    price: number;
    priceBack: number;
    color: string;
    prod_country: string;
    englishCar: boolean;
    archivized: boolean;
    production_date: Date;
    image: string;
    imageUpload: FormData;
    cars: Car;
    carId: number;
}
