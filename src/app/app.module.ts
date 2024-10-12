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
import { RegisterComponent } from './pages/register/register.component';
import { CheckboxModule } from 'primeng/checkbox';
import { EventTableComponent } from './components/event-table/event-table.component';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TreeTableModule } from 'primeng/treetable';
import { EventDetailsComponent } from './components/event-details/event-details.component';
import { DialogModule } from 'primeng/dialog';
import { ProfileComponent } from './pages/profile/profile.component';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { CardModule } from 'primeng/card';
import { JwtInterceptorService } from './interceptors/jwt-interceptor.service';
import { ErrorInterceptorService } from './interceptors/error-interceptor.service';
import { ExpiredService } from './interceptors/expired.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    LoginComponent,
    NavbarComponent,
    RegisterComponent,
    EventTableComponent,
    EventDetailsComponent,
    ProfileComponent
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
    CheckboxModule,
    TagModule,
    IconFieldModule,
    InputIconModule,
    TreeTableModule,
    DialogModule,
    AvatarModule,
    AvatarGroupModule,
    CardModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiUrlInterceptor,
      multi: true, 
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptorService,
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: ExpiredService, multi: true }
    
  ],  
  bootstrap: [AppComponent]
})
export class AppModule { }
