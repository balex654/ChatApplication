import { Component, OnDestroy, OnInit } from '@angular/core';
import { GroupChatService } from '../../services/group-chat.service';
import { GroupChat } from '../../models/group-chat';
import { User } from '../../models/user';
import { ChatService } from '../../services/chat.service';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { Message } from '../../models/message';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-group-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './group-chat.component.html',
  styleUrls: ['./group-chat.component.scss', '../chat/chat.component.scss']
})
export class GroupChatComponent implements OnInit, OnDestroy {
  public groupChat?: GroupChat;
  public groupUsers: User[] = [];
  public messages: Message[] = [];
  public message?: string;

  private destroy$ = new Subject<void>();

  constructor(
    private groupChatService: GroupChatService,
    private chatService: ChatService,
    private userService: UserService,
    private router: Router,
    private auth: AuthService,
    private messageService: MessageService
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.groupChat = this.groupChatService.groupChat;

    this.messageService.getGroupChatMessages(this.groupChat!.id!).pipe(
      takeUntil(this.destroy$),
      switchMap(async (messages) => {
        this.messages = messages;
      })
    ).subscribe();

    this.chatService.onReceivedGroupMessage.pipe(
      takeUntil(this.destroy$),
      switchMap(async (message) => {
        if (message.groupChatId! === this.groupChat!.id!) {
          this.messages.push(message);
        }
      })
    ).subscribe();
  }

  public sendMessage() {
    const message: Message = {
      fromUserId: this.userService.user!.id,
      fromUsername: this.userService.user!.username,
      date: new Date(),
      body: this.message!,
      groupChatId: this.groupChat!.id!
    };

    this.chatService.sendMessage(message);
    this.messages.push(message);
  }

  public back() {
    this.groupChatService.groupChat = undefined;
    this.router.navigate(['chats']);
  }

  public logout() {
    this.auth!.logout({
      logoutParams: {
        returnTo: window.location.origin + '/login'
      }
    });
  }
}
