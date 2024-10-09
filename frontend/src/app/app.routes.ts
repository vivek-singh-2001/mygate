import { Routes } from '@angular/router';
import { HomeComponent } from './layouts/user/home.component';
import { AuthGuard } from './gaurds/auth.guard';
import { GoogleCallbackComponent } from './services/auth/googleCallback.component';
import { RedirectIfLoggedInGuard } from './gaurds/redirect-if-logged-in.guard';
import { AdminGuard } from './gaurds/admin.gaurd';
import { SystemAdminComponent } from './layouts/system-admin/system-admin.component';
import { SystemAdminGuard } from './gaurds/system-admin.guard';
import { UnauthorizedComponent } from './components/shared/unauthorized/unauthorized.component';
import { NonSystemAdminGuard } from './gaurds/not-system-admin.gaurd';
import { RegisterComponent } from './components/shared/register/register.component';
import { LoginComponent } from './components/shared/login/login.component';
import { DashboardComponent } from './components/User/Dashboard/dashboard.component';
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
    canActivate: [AuthGuard,NonSystemAdminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'messages',
        loadComponent: () =>
          import('./components/User/chats/chats.component').then(
            (chat) => chat.ChatsComponent
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./components/User/user-detail/user-detail.component').then(
            (user) => user.UserDetailComponent
          ),
      },
      {
        path: 'apartments',
        loadComponent: () =>
          import('./components/User/apartment/apartment.component').then(
            (a) =>a.ApartmentComponent 
          ),
        canActivate: [AdminGuard],
      },
      {
        path: 'apartments/wingDetails/:name/:id',
        loadComponent: () =>
          import('./components/User/apartment/wing-details/wing-details.component').then(
            (w) =>w.WingDetailsComponent 
          ),
        canActivate: [AdminGuard],
      },
      {
        path: 'apartments/allocate-house',
        loadComponent: () =>
          import(
            './components/User/admin/allocate-house/allocate-house.component'
          ).then((a) =>a.AllocateHouseComponent ),
        canActivate: [AdminGuard],
      },
      {
        path: 'apartments/users',
        loadComponent: () =>
          import(
            './components/User/admin/society-users/society-users.component'
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
      { path: '', redirectTo: 'societies', pathMatch: 'full' },
      {
        path:'societies',
        canActivate:[SystemAdminGuard],
        loadComponent:()=>
          import(
            './components/systemAdmin/society-list/society-list.component'
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
