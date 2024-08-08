import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CompanyService } from '../../services/services-company/company.service';
import { UserService } from '../../services/services-user/user.service';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit  {
  form = {
    c_nama: '',
    c_alamat: '',
    c_no_hp: '',
    c_email: ''
  };
  
  notifications: any[] = [];
  companies: any[] = [];  
  selectedTab: string = 'companies';
  invitations: any[] = [];
  joins: any[] = [];
  offerings: any[] = []; 
  joinToCompanies: any[] = [];
  currentUserId: any;

  isDropdownOpen = false;
  isNotifications = false;
  isActiveNotifications = false;
  isBuatPerusahaanModalVisible: boolean = false;

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private companyService: CompanyService,
    private userService: UserService,
  ) {}
  
  ngOnInit(): void {
    this.loadUserCompanies();
    this.checkUserCompanyStatus();
    this.userService.getCurrentUser().subscribe(
      user => {
        this.currentUserId = user.id;
        this.loadNotifications();
      },
      error => {
        console.error('Error fetching user data', error);
      }
    );
  }

  showBuatPerusahaanModal(): void {
    this.isBuatPerusahaanModalVisible = true;
  }

  hideBuatPerusahaanModal(): void {
    this.isBuatPerusahaanModalVisible = false;
  }

  checkUserCompanyStatus(): void {
    this.userService.getUserCompanyStatus().subscribe(
      (response) => {
        if (response.status === true) {
          this.router.navigate(['/company']);
        } else if (response.status === false) {
          this.router.navigate(['/newuser']);
        }
      },
      (error) => {
        console.error('Error checking user company status', error);
      }
    );
  }

  loadNotifications(): void {
    this.companyService.getNotifications().subscribe(
      data => {
        console.log('Notifications data:', data);
        this.notifications = data;
        this.isNotifications = this.notifications.length > 0;
        this.isActiveNotifications = this.notifications.length > 0;
  
        // Filter untuk offering (tawaran) dari company lain
        this.offerings = this.notifications.filter(notification => 
          notification.type === 'invitation' &&
          notification.id_user === this.currentUserId
        );
  
        // Filter untuk invitation (mengundang) user lain ke company
        this.invitations = this.notifications.filter(notification => 
          notification.type === 'invitation' &&
          notification.requesting_id_user === this.currentUserId
        );
  
        // Filter untuk user yang join ke company
        this.joins = this.notifications.filter(notification => 
          notification.type === 'join' &&
          notification.id_user === this.currentUserId
        );

        this.joinToCompanies = this.notifications.filter(notification => 
          notification.type === 'join' &&
          notification.requesting_id_user === this.currentUserId
        );
  
        // Sorting berdasarkan updated_at
        this.offerings.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
        this.invitations.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
        this.joins.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
      },
      error => {
        console.error('Error fetching notifications', error);
      }
    );
  }
  

  respondToJoinRequest(notificationId: number, response: string): void {
    this.companyService.respondToJoinRequest(notificationId, response).subscribe(
      () => {
        console.log('Join request response success');
        // Remove or update notification
        this.loadNotifications();
      },
      error => {
        console.error('Error responding to join request', error);
      }
    );
  }

  respondToInvitation(notificationId: number, response: string): void {
    this.companyService.respondToInvitation(notificationId, response).subscribe(
      success => {
        console.log('Response recorded successfully', success);
        this.loadNotifications();
      },
      error => {
        console.error('Error responding to notification', error);
      }
    );
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  loadUserCompanies(): void {
    this.companyService.getUserCompanies().subscribe({
      next: (response) => {
        if (response.success) {
          this.companies = response.companies;
        } else {
          console.error('Berhasil load notifikasi:', response);
        }
      },
      error: (error) => {
        console.error('Error', error);
      }
    });
  }

  deleteNotification(notificationId: number): void {
    this.companyService.deleteNotification(notificationId).subscribe(
      success => {
        console.log('Berhasil menghapus notifikasi', success);
        this.loadNotifications();
      },
      error => {
        console.error('Error', error);
      }
    );
  }
  

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        // Logout berhasil
        alert('Logout berhasil');
        this.router.navigate(['']); // Navigasi ke halaman utama
      },
      error: (error) => {
        // Logout gagal
        alert('Logout gagal: ' + (error.error.message || 'Terjadi kesalahan saat logout'));
      }
    });
  }
  onSubmitCreate(createCompanyForm: NgForm) {
    if (createCompanyForm.valid) {
      this.companyService.createCompany(this.form).subscribe(
        (response) => {
          this.hideBuatPerusahaanModal();
          alert('Berhasil buat perusahaan')
          window.location.reload();
        },
        (error) => {
          console.error('Gagal membuat perusahaan', error);
        }
      );
    }
  }
}
