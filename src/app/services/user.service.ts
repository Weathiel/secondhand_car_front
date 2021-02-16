import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { User } from '../user';
import { URL } from '../config';

@Injectable({ providedIn: 'root' })
export class UserService {

    constructor(private http: HttpClient,
                private url: URL) { }

    getAll(index: number, pageSize: number) {
        // tslint:disable-next-line:max-line-length
        return this.http.get<User[]>(this.url.url + `user?page=` + index + `&size=` + pageSize, {headers: new HttpHeaders().set('Content-Type', 'application/json') });
    }

    filter(data: User) {
        return this.http.post(this.url.url + `user/filter`, data);
      }

    register(user: User) {
        return this.http.post(this.url.url + `user/register`, user);
    }

    getUserByUsername(username: string) {
        return this.http.get(this.url.url + `user?username=${username}`);
    }

    getLenght() {
        // tslint:disable-next-line:max-line-length
        return this.http.get<number>(this.url.url + `user/length`, {headers: new HttpHeaders().set('Content-Type', 'application/json') });
    }

    delete(id: number) {
        return this.http.delete<void>(this.url.url + `user/${id}`);
    }

    editProfile(id: number, user: User) {
        if (id != null) {
            return this.http.put(this.url.url + `user/editProfile/${id}`, user);
        }
        return;
    }

    update(id: number, user: User) {
        if (id != null) {
            return this.http.put(this.url.url + `user/${id}`, user);
        }
        return;
    }
}
