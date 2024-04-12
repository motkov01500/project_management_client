import { NgModule, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {
  HttpClient,
  HttpClientModule,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { AppComponent } from './app.component';
import { HomeComponent } from './base-components/home/home.component';
import { LoginComponent } from './base-components/login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { authInterceptor } from './auth/auth.interceptor';
import { WelcomeComponent } from './base-components/welcome/welcome.component';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegisterComponent } from './base-components/register/register.component';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    WelcomeComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MenubarModule,
    HttpClientModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastModule,
  ],
  providers: [
    HttpClient,
    provideHttpClient(withInterceptors([authInterceptor])),
    MessageService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule implements OnInit {
  constructor(private primeNgConfig: PrimeNGConfig) {}

  ngOnInit(): void {
    this.primeNgConfig.ripple = true;
  }
}
