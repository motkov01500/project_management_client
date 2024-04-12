import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AdministatorGuard, UserGuard } from './auth';
import { LoginComponent } from './base-components/login/login.component';
import { WelcomeComponent } from './base-components/welcome/welcome.component';
import { RegisterComponent } from './base-components/register/register.component';

const routes: Route[] = [
  {
    path: 'welcome',
    component: WelcomeComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ],
  },
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  {
    path: 'user',
    loadChildren: () =>
      import('./modules/user/user.module').then((m) => m.UserModule),
    canActivate: [UserGuard],
  },
  {
    path: 'administrator',
    loadChildren: () =>
      import('./modules/administrator/administrator.module').then(
        (m) => m.AdministratorModule
      ),
    canActivate: [AdministatorGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
