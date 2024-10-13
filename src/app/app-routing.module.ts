import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';
import { adminGuard } from './guards/admin.guard';
import { OrganizerPanelComponent } from './pages/organizer-panel/organizer-panel.component';
import { organizerGuard } from './guards/organizer.guard';

const routes: Routes = [
  {path: 'home', component: DashboardComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'user/:id', component: ProfileComponent },
  {path: 'admin-panel', component: AdminPanelComponent, canActivate: [adminGuard]},
  {path: 'organizer-panel', component: OrganizerPanelComponent, canActivate: [organizerGuard]},

  {path: '', redirectTo: '/home', pathMatch: 'full' },
  {path: '**', redirectTo: '/home' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
