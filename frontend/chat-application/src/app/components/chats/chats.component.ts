import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { ChatService } from '../../services/chat.service';
import { Subject, map, switchMap, take, takeUntil, tap } from 'rxjs';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { CreateGroupChatDialogComponent } from '../create-group-chat-dialog/create-group-chat-dialog.component';
import { GroupChatService } from '../../services/group-chat.service';
import { GroupChat } from '../../models/group-chat';

@Component({
  selector: 'app-chats',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.scss'
})
export class ChatsComponent implements OnInit, OnDestroy {
  public users: User[] = [];
  public user?: User;
  public groupChats: GroupChat[] = [];

  private destory$ = new Subject<void>();

  constructor(
    private auth: AuthService,
    private chatService: ChatService,
    private userService: UserService,
    private router: Router,
    private dialog: DialogService,
    private groupChatService: GroupChatService) {}

  ngOnInit(): void {
    if (!this.chatService.connected) {
      this.chatService.startConnection();
      this.chatService.onConnectionEstablished.pipe(
        takeUntil(this.destory$),
        switchMap(connectionId => this.auth.user$.pipe(
          map(authUser => ({ authUser, connectionId }))
        )),
        switchMap(({ authUser, connectionId }) => this.userService.getUserById(authUser!.sub!).pipe(
          map(user => ({ user, connectionId }))
        )),
        switchMap(({ user, connectionId }) => {
          this.userService.user = user;
          const u = user as User;
          u.connectionId = connectionId;
          return this.userService.updateUser(u).pipe(
            map(() =>  (user))
          );
        }),
        switchMap((user) => this.userService.getAllUsers().pipe(
          map(allUsers => ({ user, allUsers }))
        )),
        tap(({ user, allUsers }) => {
          this.chatService.sendUserConnected();
          this.user = user as unknown as User;
          this.users = allUsers.filter(x => {
            const u = user as unknown as User;
            const c = x as User;
            return c.id !== u.id;
          }) as User[];
        }),
        switchMap(() => this.groupChatService.getGroupChatsForUser(this.userService.user!.id)),
        tap((groupChats) => {
          this.groupChats = groupChats;
        })
      ).subscribe();
    }
    else {
      this.updateUsers();
      this.getGroupChats();
    }

    this.chatService.onUserConnected.pipe(
      takeUntil(this.destory$),
      tap(() => this.updateUsers())
    ).subscribe();

    this.chatService.onUserDisconnected.pipe(
      takeUntil(this.destory$),
      tap(() => this.updateUsers())
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destory$.next();
    this.destory$.complete();
  }

  private updateUsers() {
    this.auth.user$.pipe(
      takeUntil(this.destory$),
      switchMap(authUser => this.userService.getUserById(authUser!.sub!)),
      switchMap(user => {
        const u = user as User;
        this.user = u;          
        return this.userService.getAllUsers().pipe(
          map((connectedUsers) => ({ u, connectedUsers }))
        )
      }),
      tap(({ u, connectedUsers}) => {
        this.user = u;
        this.users = connectedUsers.filter(x => {
          const c = x as User;
          return c.id !== u.id;
        }) as User[];
      })
    ).subscribe();
  }

  private getGroupChats() {
    this.groupChatService.getGroupChatsForUser(this.userService.user!.id).pipe(
      takeUntil(this.destory$),
      tap(groupChats => {
        this.groupChats = groupChats;
      })
    ).subscribe();
  }

  public globalChatClick() {
    this.router.navigate(['/chat']);
  }

  public chatClick(user: User) {
    this.chatService.currentChatUser = user;
    this.router.navigate(['/chat']);
  }

  public groupChatClick(groupChat: GroupChat) {
    this.groupChatService.groupChat = groupChat;
    this.router.navigate(['/group-chat'])
  }

  public createGroupChat() {
    const ref = this.dialog.open(CreateGroupChatDialogComponent, {
      header: 'Create Group Chat'
    });

    const subscription = ref.onClose.subscribe(() => {
      subscription.unsubscribe();
      this.getGroupChats();
    });
  }

  public logout() {
    this.auth.logout({
      logoutParams: {
        returnTo: window.location.origin + '/login'
      }
    });
  }
}
