import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
// PrimeNG imports
import { ToolbarModule } from 'primeng/toolbar';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { TableModule } from 'primeng/table';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message'; 
import { MessagesModule } from 'primeng/messages';
import { RippleModule } from 'primeng/ripple';
import { ApiUrlInterceptor } from './interceptors/api-url.interceptor';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    LoginComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    //primeng
    ToolbarModule,
    PanelModule,
    ButtonModule,
    MenubarModule,
    TableModule,
    InputTextModule,
    MessageModule,
    MessagesModule,
    RippleModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiUrlInterceptor,
      multi: true, 
    },
  ],  
  bootstrap: [AppComponent]
})
export class AppModule { }
