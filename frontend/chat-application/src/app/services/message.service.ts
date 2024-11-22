import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { Message } from "../models/message";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    private baseUrl = `${environment.apiUrl}/message`;

    constructor(private httpClient: HttpClient) {}

    public getMessagesForChat(firstUser: string, secondUser: string): Observable<Message[]> {
        const query = {
            firstUser: firstUser,
            secondUser: secondUser
        };
        return this.httpClient.post<Message[]>(`${this.baseUrl}/getMessagesForChat`, query);
    }

    public getGroupChatMessages(groupId: number): Observable<Message[]> {
        return this.httpClient.get<Message[]>(`${this.baseUrl}/getGroupChatMessages?groupId=${groupId}`);
    }
}