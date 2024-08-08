import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

import { MainComponent } from './components/main/main.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { CompanyComponent } from './components/company/company.component';
import { NewuserComponent } from './components/company/newuser/newuser.component';

//company dashboard component
import { HeaderCdComponent } from './components/company/company-dashboard/header-cd/header-cd.component';
import { FooterCdComponent } from './components/company/company-dashboard/footer-cd/footer-cd.component';
import { SidebarCdComponent } from './components/company/company-dashboard/sidebar-cd/sidebar-cd.component';
import { DashboardContentComponent } from './components/company/company-dashboard/dashboard-content/dashboard-content.component';
//company dashboard/content component
import { CompanyCdComponent } from './components/company/company-dashboard/dashboard-content/company-cd/company-cd.component';
import { MemberCdComponent } from './components/company/company-dashboard/dashboard-content/member-cd/member-cd.component';
import { ProfileUserCdComponent } from './components/company/company-dashboard/dashboard-content/profile-user-cd/profile-user-cd.component';

import { GoogleCallbackComponent } from './google-callback/google-callback.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', component: HeaderComponent, outlet: 'header' },
      { path: '', component: FooterComponent, outlet: 'footer' },
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'company', component: CompanyComponent, canActivate: [AuthGuard] },
  { path: 'newuser', component: NewuserComponent, canActivate: [AuthGuard] },
  {
    path: 'company/:id/dashboard',
    component: DashboardContentComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: SidebarCdComponent, outlet: 'sidebar' },
      { path: '', component: HeaderCdComponent, outlet: 'header' },
      { path: '', component: FooterCdComponent, outlet: 'footer' },
      { path: 'company', component: CompanyCdComponent},
      { path: 'member', component: MemberCdComponent},
      { path: 'profileUser', component: ProfileUserCdComponent},
    ]
  },
  { path: 'auth/google/callback', component: GoogleCallbackComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
