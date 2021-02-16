import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router, ExtraOptions } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './services/auth.guard';
import { RegisterComponent } from './register/register.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { OrdersManagmentComponent } from './orders-managment/orders-managment.component';
import { OfferManagmentComponent } from './offer-managment/offer-managment.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { MessageComponent } from './message/message.component';
import { CarsManagmentComponent } from './cars-managment/cars-managment.component';
import { OfferDetailsComponent } from './offer-details/offer-details.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'offerDetail', component: OfferDetailsComponent },
  { path: 'editprofile', component: EditProfileComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'management', component: UserManagementComponent, canActivate: [AuthGuard]},
  { path: 'ordermanagement', component: OrdersManagmentComponent, canActivate: [AuthGuard]},
  { path: 'offermanagement', component: OfferManagmentComponent, canActivate: [AuthGuard]},
  { path: 'carsmanagement', component: CarsManagmentComponent, canActivate: [AuthGuard]},
  { path: 'message', component: MessageComponent, canActivate: [AuthGuard]},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
