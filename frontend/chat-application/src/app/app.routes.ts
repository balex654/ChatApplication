import { Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { LoginComponent } from './components/login/login.component';
import { ChatsComponent } from './components/chats/chats.component';
import { GroupChatComponent } from './components/group-chat/group-chat.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'chats',
        component: ChatsComponent
    },
    {
        path: 'chat',
        component: ChatComponent
    },
    {
        path: 'group-chat',
        component: GroupChatComponent
    },
    {
        path: 'login',
        component: LoginComponent
    }
];
