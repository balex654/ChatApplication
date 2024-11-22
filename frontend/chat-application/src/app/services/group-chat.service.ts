import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { User } from "../models/user";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { GroupChat } from "../models/group-chat";

@Injectable({
    providedIn: 'root'
})
export class GroupChatService {
    public groupChat?: GroupChat;

    private baseUrl = `${environment.apiUrl}/GroupChat`

    constructor(private httpClient: HttpClient) {}

    public createGroupChat(users: User[], groupChat: GroupChat): Observable<void> {
        const body = {
            users: users,
            groupChat: groupChat
        };
        return this.httpClient.post<void>(`${this.baseUrl}`, body);
    }

    public getGroupChatsForUser(userId: string): Observable<GroupChat[]> {
        return this.httpClient.get<GroupChat[]>(`${this.baseUrl}/GetGroupChatsForUser/?userId=${userId}`)
    }
}