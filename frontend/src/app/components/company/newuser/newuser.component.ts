import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../../services/auth.service'; 
import { Router } from '@angular/router';
import { CompanyService } from '../../../services/services-company/company.service';
import { UserService } from '../../../services/services-user/user.service';

@Component({
  selector: 'app-newuser',
  templateUrl: './newuser.component.html',
  styleUrls: ['./newuser.component.css']
})
export class NewuserComponent {
  form = {
    c_nama: '',
    c_alamat: '',
    c_no_hp: '',
    c_email: ''
  };
  joinForm = {
    token: '',
    id_role: null
  };
  roles = [
    { id: 1, role: 'investor' },
    { id: 2, role: 'business owner' },
    { id: 3, role: 'komisaris' },
    { id: 4, role: 'direktur' },
    { id: 5, role: 'manager' },
    { id: 6, role: 'supervisor' },
    { id: 7, role: 'staff' }
  ];
  notifications: any[] = [];
  invitations: any[] = [];
  joins: any[] = [];
  
  isBuatPerusahaanModalVisible: boolean = false;
  isGabungModalVisible: boolean = false;
  isDropdownOpen = false;
  isNotifications = false;
  isActiveNotifications: boolean = false;

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private companyService: CompanyService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
    this.checkUserCompanyStatus();
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

  loadNotifications(): void {
    this.companyService.getNotifications().subscribe(
      data => {
        console.log('Notifications data:', data); // Tambahkan log untuk debugging
        // Pisahkan notifikasi berdasarkan tipe
        this.notifications = data;
        this.isNotifications = this.notifications.length > 0;
        this.isActiveNotifications = this.notifications.length > 0;
        this.invitations = this.notifications.filter(notification => notification.type === 'invitation');
        this.joins = this.notifications.filter(notification => notification.type === 'join');
        
        // Sorting berdasarkan updated_at
        this.invitations.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
        this.joins.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
      },
      error => {
        console.error('Error fetching notifications', error);
      }
    );
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

  hideDropdown() {
    this.isDropdownOpen = false;
  }

  deleteNotification(notificationId: number) {

  }

  showBuatPerusahaanModal(): void {
    this.isBuatPerusahaanModalVisible = true;
  }

  hideBuatPerusahaanModal(): void {
    this.isBuatPerusahaanModalVisible = false;
  }

  showGabungModal(): void {
    this.isGabungModalVisible = true;
  }

  hideGabungModal(): void {
    this.isGabungModalVisible = false;
  }

  onSubmitCreate(createCompanyForm: NgForm) {
    if (createCompanyForm.valid) {
      this.companyService.createCompany(this.form).subscribe(
        (response) => {
          this.hideBuatPerusahaanModal();
          alert('Berhasil buat perusahaan')
          this.router.navigate(['/company'])
        },
        (error) => {
          console.error('Gagal membuat perusahaan', error);
        }
      );
    }
  }

  onSubmitJoin(joinCompanyForm: NgForm) {
    if (joinCompanyForm.valid) {
      this.companyService.joinByToken(this.joinForm).subscribe(
        (response) => {
          this.hideGabungModal();
          this.router.navigate(['/newuser']);
          this.loadNotifications();
          alert('Permintaan bergabung telah dikirim dan menunggu persetujuan.')
        },
        (error) => {
          console.error('Gagal bergabung, cek token', error);
          alert('Gagal bergabung, cek token');
        }
      );
    }
  }
  
}
