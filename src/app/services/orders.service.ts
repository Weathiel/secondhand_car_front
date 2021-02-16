import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { User } from '../user';
import { URL } from '../config';
import { Orders } from '../orders';
import { AuthenticationService } from './authentication.service';
import { OrderFilter } from '../orderFilter';

@Injectable({ providedIn: 'root' })
export class OrdersService {


    constructor(private http: HttpClient,
                private authService: AuthenticationService,
                private url: URL) { }

    getAll(index: number, pageSize: number, sortBy: string, sortOrder: string) {
        let isWorker = false;
        // tslint:disable-next-line:max-line-length
        this.authService.currentUserValue.role.forEach(rol => {
            if (rol === 'ROLE_WORKER') {
                isWorker = true;
                return;
            }
        });

        if (isWorker) {
            return this.http.get<Orders[]>(this.url.url + `orders?page=` + index +
            `&size=` + pageSize + '&sortBy=' + sortBy + '&sortOrder=' + sortOrder);
        } else {
            return this.getMyOrders(index, pageSize, sortBy, sortOrder);
        }
    }

    getOne(id) {
        return this.http.get<Orders>(this.url.url + `orders/${id}`);
    }

    filter(orderFilter: OrderFilter) {
        return this.http.post<Orders[]>(this.url.url + `orders/filter`, orderFilter);
      }

    new(order: Orders) {
        return this.http.post(this.url.url + `orders/new`, order);
    }

    getMyOrders(index: number, pageSize: number, sortBy: string, sortOrder: string) {
        return this.http.get<Orders[]>(this.url.url + `orders/token?page=` + index +
        `&size=` + pageSize + '&sortBy=' + sortBy + '&sortOrder=' + sortOrder);
    }

    getMyLenght() {
        return this.http.get<number>(this.url.url + `orders/userLength`);
    }

    getLenght() {
        let isWorker = false;
        // tslint:disable-next-line:max-line-length
        this.authService.currentUserValue.role.forEach(rol => {
            if (rol === 'ROLE_WORKER') {
                isWorker = true;
                return;
            }
        });
        if (isWorker) {
            return this.http.get<number>(this.url.url + `orders/length`,
             {headers: new HttpHeaders().set('Content-Type', 'application/json') });
        }
        return this.getMyLenght();
    }

    update(id, order: Orders) {
        return this.http.put(this.url.url + `orders/` + id, order);
    }

    delete(id: number) {
        return this.http.delete(this.url.url + `orders/${id}`);
    }
}
