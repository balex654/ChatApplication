import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { User } from "../models/user";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private baseUrl = `${environment.apiUrl}/user`
    public user?: User;

    constructor(private httpClient: HttpClient) {}

    public getUserById(id: string): Observable<User> {
        return this.httpClient.get<User>(`${this.baseUrl}/${id}`);
    }

    public createUser(user: User): Observable<void> {
        return this.httpClient.post<void>(`${this.baseUrl}`, user);
    }

    public updateUser(user: User): Observable<void> {
        return this.httpClient.put<void>(`${this.baseUrl}`, user);
    }

    public getConnectedUsers(): Observable<User[]> {
        return this.httpClient.get<User[]>(`${this.baseUrl}/GetConnectedUsers`);
    }

    public getAllUsers(): Observable<User[]> {
        return this.httpClient.get<User[]>(`${this.baseUrl}`);
    }
}