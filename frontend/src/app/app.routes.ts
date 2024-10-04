import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './layouts/user/home.component';
import { AuthGuard } from './gaurds/auth.guard';
import { GoogleCallbackComponent } from './services/auth/googleCallback.component';
import { RedirectIfLoggedInGuard } from './gaurds/redirect-if-logged-in.guard';
import { AdminGuard } from './gaurds/admin.gaurd';
import { DashboardComponent } from './components/Dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { SystemAdminComponent } from './layouts/system-admin/system-admin.component';
import { SystemAdminGuard } from './gaurds/system-admin.guard';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
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
          import('./components/apartment/apartment.component').then(
            (a) =>a.ApartmentComponent 
          ),
        canActivate: [AdminGuard],
      },
      {
        path: 'apartments/wingDetails/:name/:id',
        loadComponent: () =>
          import('./components/apartment/wing-details/wing-details.component').then(
            (w) =>w.WingDetailsComponent 
          ),
        canActivate: [AdminGuard],
      },
      {
        path: 'apartments/allocate-house',
        loadComponent: () =>
          import(
            './components/admin/allocate-house/allocate-house.component'
          ).then((a) =>a.AllocateHouseComponent ),
        canActivate: [AdminGuard],
      },
      {
        path: 'apartments/users',
        loadComponent: () =>
          import(
            './components/admin/society-users/society-users.component'
          ).then((w) => w.SocietyUsersComponent),
        canActivate: [AdminGuard],
      },
    ],
  },
  {
    path:'systemAdmin',
    component:SystemAdminComponent,
    canActivate:[AuthGuard,SystemAdminGuard],
    children:[
      {
        path:'societies',
        loadComponent:()=>
          import(
            './components/society-list/society-list.component'
          ).then((s)=>s.SocietyListComponent)
      }
    ]
  },
  { path: 'unauthorized', component: UnauthorizedComponent },
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
