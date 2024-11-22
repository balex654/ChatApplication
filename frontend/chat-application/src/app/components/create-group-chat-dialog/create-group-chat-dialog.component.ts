import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { map, Subject, takeUntil, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { GroupChatService } from '../../services/group-chat.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-group-chat-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-group-chat-dialog.component.html',
  styleUrl: './create-group-chat-dialog.component.scss'
})
export class CreateGroupChatDialogComponent implements OnInit, OnDestroy {
  public users: UserSelection[] = [];
  public groupNameInput: string = '';

  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private groupChatService: GroupChatService,
    private dialogRef: DynamicDialogRef
  ) {}

  ngOnInit(): void {
    this.userService.getAllUsers().pipe(
      takeUntil(this.destroy$),
      map(users => users.filter(u => u.id !== this.userService.user!.id))
    ).subscribe(users => {
      this.users = users.map(u => {
        return {
          user: u,
          isSelected: false
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public userClick(u: UserSelection) {
    u.isSelected = !u.isSelected;
  }

  public createGroup() {
    const groupUsers = this.users.filter(u => u.isSelected).map(u => u.user);
    groupUsers.push(this.userService.user!);
    this.groupChatService.createGroupChat(groupUsers, { name: this.groupNameInput }).pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.dialogRef.close();
    });
  }
}

interface UserSelection {
  user: User;
  isSelected: boolean;
}
