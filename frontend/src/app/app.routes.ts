import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './views/home/home.component';
import { AuthGuard } from './gaurds/auth.guard';
import { GoogleCallbackComponent } from './services/auth/googleCallback.component';
import { RedirectIfLoggedInGuard } from './gaurds/redirect-if-logged-in.guard';
import { AdminGuard } from './services/admin/admin.gaurd';
import { DashboardComponent } from './components/Dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [RedirectIfLoggedInGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,

  },
  {
    path: 'google/success',
    component: GoogleCallbackComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'messages',
        loadComponent: () =>
          import('./components/chats/chats.component').then(
            (chat) => chat.ChatsComponent
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./components/user-detail/user-detail.component').then(
            (user) => user.UserDetailComponent
          ),
      },
      {
        path: 'apartments',
        loadComponent: () =>
          import('./components/admin/admin.component').then(
            (admin) => admin.AdminComponent
          ),
        canActivate: [AdminGuard],
      },
      {
        path: 'apartments/wingDetails/:name/:id',
        loadComponent: () =>
          import(
            './components/apartment/wing-details/wing-details.component'
          ).then((w) => w.WingDetailsComponent),
        canActivate: [AdminGuard],
      },
    ],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
