import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { SocialAuthService, GoogleLoginProvider } from '@abacritt/angularx-social-login';


export interface LoginResponse {
  message: string;
  access_token: string;
  token_type: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form = {
    login: '',
    password: '',
    rememberMe: false
  };
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private socialAuthService: SocialAuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.authService.setAuthToken(token);
        this.router.navigate(['/newuser']);
      }
    });
  }

  isFormComplete(): boolean {
    return this.form.login.trim() !== '' && this.form.password.trim() !== '';
  }

  submitLogin(loginForm: NgForm) {
    if (loginForm.valid && this.isFormComplete()) {
      const loginData = { login: this.form.login, password: this.form.password };
  
      this.authService.login(loginData).subscribe({
        next: (response: LoginResponse) => {
          if (response && response.access_token) {
            this.authService.setAuthToken(response.access_token);
            this.authService.hasCompany().subscribe({
              next: (hasCompany: boolean) => { 
                if (hasCompany) {
                  this.router.navigate(['/company']);
                } else {
                  this.router.navigate(['/newuser']);
                }
              },
              error: (error) => {
                console.error('Error checking user company:', error);
                alert('Terjadi kesalahan saat memeriksa perusahaan pengguna.');
              }
            });
          } else {
            console.error('Unexpected response format:', response);
            alert('Login gagal: Format respons tidak sesuai');
          }
        },
        error: (error) => {
          // Ambil pesan error dari backend
          const errorMessage = error.message || 'Terjadi kesalahan saat login';
          alert('Login gagal: ' + errorMessage);
          this.error = errorMessage;
        }
      });
    } else {
      alert('Form tidak lengkap');
    }
  }
  

  // signInWithGoogle(): void {
  //   this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(user => {
  //     if (user && user.idToken) {
  //       this.authService.loginWithGoogle(user.idToken).subscribe(response => {
  //         this.authService.setAuthToken(response.access_token);
  //         this.router.navigate(['/newuser']);
  //       }, error => {
  //         console.error('Login gagal:', error);
  //       });
  //     }
  //   }).catch(error => {
  //     console.error('Error Google login:', error);
  //   });
  // }
  signInWithGoogle() {
    window.location.href = 'http://localhost:8000/auth/google'; 
  }
  
  
}
