import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Subscription, filter, iif, of, switchMap, withLatestFrom } from 'rxjs';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {
  private authSubscription?: Subscription;

  constructor(
    private auth: AuthService, 
    private router: Router,
    private userService: UserService) {}

  ngOnInit(): void {
    this.authSubscription = this.auth.isAuthenticated$.pipe(
      filter(isAuthenticated => isAuthenticated),
      switchMap(() => this.auth.user$),
      switchMap((authUser) => this.userService.getUserById(authUser!.sub!).pipe(
        withLatestFrom(of(authUser))
      )),
      switchMap(([user, authUser]) => iif(
        () => user === null,
        this.userService.createUser({
          id: authUser!.sub!,
          username: authUser!.email!,
          connectionId: null
        }),
        of(user)
      ))
    ).subscribe(() => {
      this.router.navigate(['chats']);
    });
  }

  ngOnDestroy(): void {
    this.authSubscription!.unsubscribe();
  }

  public login() {
    this.auth.loginWithRedirect();
  }
}
