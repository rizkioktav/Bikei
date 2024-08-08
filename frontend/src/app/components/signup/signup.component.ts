import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  form = {
    nama: '',
    email: '',
    no_hp: '',
    password: '',
    password_confirmation: ''
  };
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  submitSignup(signupForm: NgForm) {
    if (signupForm.valid) {
      if (this.form.password !== this.form.password_confirmation) {
        this.error = 'Password dan konfirmasi password tidak cocok';
        return;
      }

      this.authService.signup(this.form).subscribe({
        next: (response) => {
          console.log('Registration successful', response);
          alert('Registrasi berhasil!');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.error = error.error.message || 'Registrasi gagal, coba lagi nanti';
          alert(this.error);
        }
      });
    } else {
      this.error = 'Form tidak lengkap';
      alert(this.error);
    }
  }
}
