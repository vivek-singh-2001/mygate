import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './views/home/home.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';

import { AuthGuard } from './gaurds/auth.guard';
import { GoogleCallbackComponent } from './services/auth/googleCallback.component';
import { RedirectIfLoggedInGuard } from './gaurds/redirect-if-logged-in.guard';
export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [RedirectIfLoggedInGuard]
  },
  {
    path: 'google/success',
    component: GoogleCallbackComponent
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      // { path: '', redirectTo: 'messages', pathMatch: 'full' },
      { path: 'messages', loadComponent: () => import('./components/chats/chats.component').then((chat) => chat.ChatsComponent) },
      { path: 'profile', component: UserDetailComponent}
    ]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
