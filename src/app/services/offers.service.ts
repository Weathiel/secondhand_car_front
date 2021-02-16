import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { URL } from '../config';
import { Offer } from '../offer';
import { Car } from '../car';
import { OfferFilter } from '../offerFilter';

@Injectable({ providedIn: 'root' })
export class OffersService {

    offer: Offer;
    offerId: number;

    constructor(private http: HttpClient,
                private url: URL) { }
    getAll(index: number, pageSize: number , sortBy: string, sortOrder: string) {
        // tslint:disable-next-line:max-line-length
        return this.http.get<Offer[]>(this.url.url + `offers?page=` + index + `&size=` + pageSize + '&sortBy=' + sortBy + '&sortOrder=' + sortOrder);
    }
    create(order: Offer, img: FormData) {
        return this.http.post<Offer>(this.url.url + `offers/new`, order);
    }
    getLenght() {
        return this.http.get<number>(this.url.url + `offers/lenght`, {headers: new HttpHeaders().set('Content-Type', 'application/json') });
    }
    setImage(order: Offer, img) {
        return this.http.post(this.url.url + `offers/` + order.offerId, img).subscribe();
    }
    getImage() {
        return this.http.get<string>(this.url.url + `test/vl`);
    }
    update(id, order: Offer) {
        return this.http.put(this.url.url + `offers/` + id, order);
    }
    delete(id: number) {
        return this.http.delete(this.url.url + `offers/${id}`);
    }
    findFiltered(filter: OfferFilter) {
        return this.http.post(this.url.url + `offers/findOffer`, filter);
    }
    getOne(id: number) {
        return this.http.get(this.url.url + `offers/${id}`);
    }

    getQueue(vin: string) {
        return this.http.get(this.url.url + `offers/queue/${vin}`);
    }
}
