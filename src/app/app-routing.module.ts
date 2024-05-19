import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AdministatorGuard, UserGuard } from './auth';
import { LoginComponent } from './base-components/login/login.component';
import { RegisterComponent } from 'app/base-components';
import { NotFoundComponent } from 'app/base-components';

const routes: Route[] = [
  {
    path: 'login',
    component: LoginComponent,
  },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
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
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
