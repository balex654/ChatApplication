import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { FormsModule } from '@angular/forms';
import { Message } from '../../models/message';
import { CommonModule } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { UserService } from '../../services/user.service';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { User } from '../../models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, OnDestroy {
  public username?: string;
  public usernameInputText?: string;
  public message?: string;
  public messages: Message[] = [];
  public currentChatUser?: User;
  public typing: boolean = false;
  public typingTimeoutId: any;

  private destroy$ = new Subject<void>();

  constructor(
    private chatService: ChatService,
    private auth: AuthService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.currentChatUser = this.chatService.currentChatUser;

    this.messageService.getMessagesForChat(this.userService.user!.id, this.currentChatUser ? this.currentChatUser.id : "").pipe(
      takeUntil(this.destroy$),
      tap((messages: Message[]) => this.messages = messages)
    ).subscribe();
    
    this.auth.user$.pipe(
      takeUntil(this.destroy$),
      switchMap((authUser) => this.userService.getUserById(authUser!.sub!)),
      tap((user) => {
        const u = user as User;
        this.username = u.username;
      })
    ).subscribe();
    
    this.chatService.onReceivedMessage.pipe(
      takeUntil(this.destroy$),
      switchMap(async (message) => {
        if (this.currentChatUser && message.fromUserId === this.currentChatUser!.id) {
          this.messages.push(message);
        }
        else if (!this.currentChatUser) {
          this.messages.push(message);
        }
      })
    ).subscribe();
    
    this.chatService.onUsernameChanged.pipe(
      takeUntil(this.destroy$),
      switchMap(async (usernameChangedEvent) => {
        if ((this.chatService.currentChatUser?.connectionId === undefined || this.currentChatUser!.username === usernameChangedEvent.oldUsername)
            && usernameChangedEvent.newUsername !== this.userService.user!.username) {
          this.messages.push({
            fromUserId: '',
            fromUsername: '',
            toUserId: '',
            date: new Date(),
            body: `${usernameChangedEvent.oldUsername} has changed their username to ${usernameChangedEvent.newUsername}`,
            toConnectionId: ''
          })
        }
        if (this.currentChatUser && this.currentChatUser!.username === usernameChangedEvent.oldUsername) {
          this.currentChatUser!.username = usernameChangedEvent.newUsername;
        }
      })
    ).subscribe();
    
    this.chatService.onUserDisconnected.pipe(
      takeUntil(this.destroy$),
      switchMap(async (user: User) => {
        if (user.id === this.chatService.currentChatUser!.id) {
          this.chatService.currentChatUser!.connectionId = null;
        }
      })
    ).subscribe();

    this.chatService.onUserConnected.pipe(
      takeUntil(this.destroy$),
      switchMap(async (user: User) => {
        if (user.id === this.chatService.currentChatUser!.id) {
          this.chatService.currentChatUser = user;
          this.currentChatUser = user;
        }
      })
    ).subscribe();

    this.chatService.onUserTyping.pipe(
      takeUntil(this.destroy$),
      switchMap(async (user: User) => {
        if (this.chatService.currentChatUser!.id === user.id) {
          this.typing = true;
        }
      })
    ).subscribe();

    this.chatService.onUserStoppedTyping.pipe(
      takeUntil(this.destroy$),
      switchMap(async (user: User) => {
        if (this.chatService.currentChatUser!.id === user.id) {
          this.typing = false;
        }
      })
    ).subscribe();
  }

  public sendMessage() {
    const message: Message = {
      fromUserId: this.userService.user!.id,
      fromUsername: this.username!,
      toUserId: this.currentChatUser ? this.currentChatUser!.id : "",
      date: new Date(),
      body: this.message!,
      toConnectionId: this.chatService.currentChatUser ? this.chatService.currentChatUser!.connectionId! : ''
    };

    if (!this.currentChatUser) {
      this.chatService.broadcastMessage(message);
    }
    else {
      this.chatService.sendMessage(message);
      this.messages.push(message);
    }
  }

  public setUsername() {
    this.auth.user$.pipe(
      takeUntil(this.destroy$),
      switchMap((authUser) => this.userService.getUserById(authUser!.sub!)),
      switchMap((user) => {
        const u = user as User;
        u.username  = this.usernameInputText!;
        this.userService.user = u;
        return this.userService.updateUser(u);
      })
    ).subscribe();

    this.userService.user!.username = this.usernameInputText!;
    const message: Message = {
      fromUserId: this.userService.user!.id,
      fromUsername: this.userService.user!.username,
      toUserId: this.currentChatUser ? this.currentChatUser.id : "",
      date: new Date(),
      body: `${this.username} has changed their username to ${this.usernameInputText}`,
      toConnectionId: this.chatService.currentChatUser ? this.chatService.currentChatUser!.connectionId! : ''
    }
    this.chatService.sendUsernameChanged(message, this.username!, this.usernameInputText!, this.currentChatUser?.connectionId!);
    this.messages.push({
      fromUserId: '',
      fromUsername: '',
      toUserId: '',
      date: new Date(),
      body: `You changed your username to ${this.usernameInputText}`,
      toConnectionId: ''
    })
    this.username = this.usernameInputText;
  }

  public messageInputChange(): void {
    if (this.currentChatUser) {
      this.chatService.sendUserTyping(this.chatService.currentChatUser!, this.userService.user!);
      if (this.typingTimeoutId) {
        clearTimeout(this.typingTimeoutId);
      }
      this.typingTimeoutId = setTimeout(() => {
        this.chatService.sendUserStoppedTyping(this.chatService.currentChatUser!, this.userService.user!);
      }, 3000);
    }
    
  }

  public back() {
    this.chatService.currentChatUser = undefined;
    this.router.navigate(['chats']);
  }

  public logout() {
    this.auth!.logout({
      logoutParams: {
        returnTo: window.location.origin + '/login'
      }
    })
  }
}
