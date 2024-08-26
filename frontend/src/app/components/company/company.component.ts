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
  isBuatPerusahaanModalVisible: boolean = false;
  isActiveNotifications: boolean = false;

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private companyService: CompanyService,
    private userService: UserService
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
        alert('Gagal mengambil data pengguna');
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
        alert('Gagal memeriksa status perusahaan pengguna');
      }
    );
  }

  loadNotifications(): void {
    this.companyService.getNotifications().subscribe(
      data => {
        this.notifications = data;
        this.isNotifications = this.notifications.length > 0;
        this.isActiveNotifications = this.notifications.length > 0;
  
        this.offerings = this.notifications.filter(notification => 
          notification.type === 'invitation' &&
          notification.id_user === this.currentUserId
        );
  
        this.invitations = this.notifications.filter(notification => 
          notification.type === 'invitation' &&
          notification.requesting_id_user === this.currentUserId
        );
  
        this.joins = this.notifications.filter(notification => 
          notification.type === 'join' &&
          notification.id_user === this.currentUserId
        );

        this.joinToCompanies = this.notifications.filter(notification => 
          notification.type === 'join' &&
          notification.requesting_id_user === this.currentUserId
        );
  
        this.offerings.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
        this.invitations.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
        this.joins.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
      },
      error => {
        console.error('Error fetching notifications', error);
        alert('Gagal mengambil notifikasi');
      }
    );
  }

  respondToJoinRequest(notificationId: number, response: string): void {
    this.companyService.respondToJoinRequest(notificationId, response).subscribe(
      () => {
        alert('Tanggapan permintaan bergabung berhasil');
        this.loadNotifications();
      },
      error => {
        console.error('Error responding to join request', error);
        alert('Gagal menanggapi permintaan bergabung');
      }
    );
  }

  respondToInvitation(notificationId: number, response: string): void {
    this.companyService.respondToInvitation(notificationId, response).subscribe(
      () => {
        alert('Tanggapan undangan berhasil');
        this.loadNotifications();
      },
      error => {
        console.error('Error responding to notification', error);
        alert('Gagal menanggapi undangan');
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
          console.error('Gagal memuat perusahaan', response);
          alert('Gagal memuat perusahaan');
        }
      },
      error: (error) => {
        console.error('Error', error);
        alert('Gagal memuat perusahaan');
      }
    });
  }

  deleteNotification(notificationId: number): void {
    this.companyService.deleteNotification(notificationId).subscribe(
      () => {
        alert('Notifikasi berhasil dihapus');
        this.loadNotifications();
      },
      error => {
        console.error('Error deleting notification', error);
        alert('Gagal menghapus notifikasi');
      }
    );
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        alert('Logout berhasil');
        this.router.navigate(['']);
      },
      error: (error) => {
        alert('Logout gagal: ' + (error.error.message || 'Terjadi kesalahan saat logout'));
      }
    });
  }

  onSubmitCreate(createCompanyForm: NgForm) {
    if (createCompanyForm.valid) {
      this.companyService.createCompany(this.form).subscribe(
        () => {
          this.hideBuatPerusahaanModal();
          alert('Perusahaan berhasil dibuat');
          this.loadUserCompanies(); // Lebih baik muat ulang data perusahaan tanpa reload halaman
        },
        error => {
          console.error('Gagal membuat perusahaan', error);
          alert('Gagal membuat perusahaan');
        }
      );
    }
  }
}
