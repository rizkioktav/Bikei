import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-google-callback',
  templateUrl: './google-callback.component.html',
  styleUrl: './google-callback.component.css'
})
export class GoogleCallbackComponent {
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.authService.setAuthToken(token);
        this.authService.hasCompany().subscribe(hasCompany => {
          if (hasCompany) {
            this.router.navigate(['/company']);
          } else {
            this.router.navigate(['/newuser']);
          }
        });
      } else {
        console.error('Token tidak ditemukan');
        this.router.navigate(['/login']);
      }
    });
  }
}
