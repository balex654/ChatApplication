import { Injectable } from "@angular/core";
import * as signalR from '@microsoft/signalr';
import { Message } from "../models/message";
import { Observable, Subject } from "rxjs";
import { environment } from "../../environments/environment";
import { User } from "../models/user";
import { UsernameChangedEvent } from "../models/username-changed-event";

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private hubConnection: signalR.HubConnection;
    private onReceivedMessageSub: Subject<Message> = new Subject();
    private onConnectionEstablishedSub: Subject<string> = new Subject();
    private onUserConnectedSub: Subject<User> = new Subject();
    private onUsernameChangedSub: Subject<UsernameChangedEvent> = new Subject();
    private onUserDisconnectedSub: Subject<User> = new Subject();
    private onUserTypingSub: Subject<User> = new Subject();
    private onUserStoppedTypingSub: Subject<User> = new Subject();
    private onReceivedGroupMessageSub: Subject<Message> = new Subject();

    public onReceivedMessage: Observable<Message> = this.onReceivedMessageSub.asObservable();
    public onConnectionEstablished: Observable<string> = this.onConnectionEstablishedSub.asObservable();
    public onUserConnected: Observable<User> = this.onUserConnectedSub.asObservable();
    public onUsernameChanged: Observable<UsernameChangedEvent> = this.onUsernameChangedSub.asObservable();
    public onUserDisconnected: Observable<User> = this.onUserDisconnectedSub.asObservable();
    public onUserTyping: Observable<User> = this.onUserTypingSub.asObservable();
    public onUserStoppedTyping: Observable<User> = this.onUserStoppedTypingSub.asObservable();
    public onReceivedGroupMessage: Observable<Message> = this.onReceivedGroupMessageSub.asObservable();
    public connected: boolean = false;
    public currentChatUser?: User;

    constructor() {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${environment.apiUrl}/chathub`, {
                withCredentials: false
            })
            .build();
    }

    public startConnection() {
        this.listenForMessages();
        this.listenForConnectionEstablished();
        this.listenForUsernameChanged();
        this.listenForDisconnected();
        this.listenForUserConnected();
        this.listenForUserDisconnected();
        this.listenForUserTyping();
        this.listenForUserStoppedTyping();
        this.listenForGroupMessage();
        this.hubConnection.start().then(() => {
            console.log("Connection established");
        })
        .catch(err => console.log("Error connecting: " + err));
    }

    private listenForMessages() {
        this.hubConnection.on('ReceiveMessage', (message: Message) => {
            this.onReceivedMessageSub.next(message);
        });
    }

    private listenForGroupMessage() {
        this.hubConnection.on('ReceiveGroupMessage', (message: Message) => {
            this.onReceivedGroupMessageSub.next(message);
        });
    }

    private listenForConnectionEstablished() {
        this.hubConnection.on('ConnectionEstablished', (connectionId: string) => {
            this.connected = true;
            this.onConnectionEstablishedSub.next(connectionId);
        });
    }

    private listenForUsernameChanged() {
        this.hubConnection.on('UsernameChanged', (oldUsername: string, newUsername: string) => {
            this.onUsernameChangedSub.next({
                oldUsername: oldUsername,
                newUsername: newUsername
            });
        });
    }

    private listenForUserConnected() {
        this.hubConnection.on('UserConnected', (user: User) => {
            this.onUserConnectedSub.next(user);
        });
    }

    private listenForUserDisconnected() {
        this.hubConnection.on('UserDisconnected', (user: User) => {
            this.onUserDisconnectedSub.next(user);
        })
    }

    private listenForDisconnected() {
        this.hubConnection.on('Disconnected', () => {
            this.connected = false;
        });
    }

    private listenForUserTyping() {
        this.hubConnection.on('UserTyping', (user: User) => {
            this.onUserTypingSub.next(user);
        })
    }

    private listenForUserStoppedTyping() {
        this.hubConnection.on('UserStoppedTyping', (user: User) => {
            this.onUserStoppedTypingSub.next(user);
        })
    }

    public sendUserConnected() {
        this.hubConnection.invoke('SendUserConnected')
            .catch(err => console.error('Error sending message: ' + err));
    }
    
    public sendMessage(message: Message) {
        this.hubConnection.invoke('SendMessage', message)
            .catch(err => console.error('Error sending message: ' + err));
    }

    public broadcastMessage(message: Message) {
        this.hubConnection.invoke('BroadcastMessage', message)
            .catch(err => console.error('Error sending message: ' + err));
    }

    public sendUsernameChanged(message: Message, oldUsername: string, newUsername: string, connectionId: string) {
        this.hubConnection.invoke('UsernameChanged', message, oldUsername, newUsername, connectionId)
            .catch(err => console.error('Error sending message: ' + err));
    }

    public sendUserTyping(toUser: User, fromUser: User) {
        this.hubConnection.invoke('SendUserTyping', toUser, fromUser).catch(err => console.error('Error sending message: ' + err));
    }

    public sendUserStoppedTyping(toUser: User, fromUser: User) {
        this.hubConnection.invoke('SendUserStoppedTyping', toUser, fromUser).catch(err => console.error('Error sending message: ' + err));
    }
}