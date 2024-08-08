import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule,  HTTP_INTERCEPTORS  } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MainComponent } from './components/main/main.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { CompanyComponent } from './components/company/company.component';
import { FeatureComponent } from './components/feature/feature.component';
import { NewuserComponent } from './components/company/newuser/newuser.component';
import { HeaderCdComponent } from './components/company/company-dashboard/header-cd/header-cd.component';
import { FooterCdComponent } from './components/company/company-dashboard/footer-cd/footer-cd.component';
import { DashboardContentComponent } from './components/company/company-dashboard/dashboard-content/dashboard-content.component';
import { SidebarCdComponent } from './components/company/company-dashboard/sidebar-cd/sidebar-cd.component';
import { CompanyCdComponent } from './components/company/company-dashboard/dashboard-content/company-cd/company-cd.component';
import { MemberCdComponent } from './components/company/company-dashboard/dashboard-content/member-cd/member-cd.component';
import { ProfileUserCdComponent } from './components/company/company-dashboard/dashboard-content/profile-user-cd/profile-user-cd.component';
import { GoogleCallbackComponent } from './google-callback/google-callback.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MainComponent,
    SignupComponent,
    LoginComponent,
    CompanyComponent,
    FeatureComponent,
    NewuserComponent,
    HeaderCdComponent,
    FooterCdComponent,
    DashboardContentComponent,
    SidebarCdComponent,
    CompanyCdComponent,
    MemberCdComponent,
    ProfileUserCdComponent,
    GoogleCallbackComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    SocialLoginModule
  ],
  providers: [
    AuthService,
    TokenService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.googleClientId)
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
