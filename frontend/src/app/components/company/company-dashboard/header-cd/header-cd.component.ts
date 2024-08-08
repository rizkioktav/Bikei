import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompanyService } from '../../../../services/services-company/company.service';
import { SidebarService } from '../../../../services-ui/sidebar.service';
import { UserService } from '../../../../services/services-user/user.service';

@Component({
  selector: 'app-header-cd',
  templateUrl: './header-cd.component.html',
  styleUrls: ['./header-cd.component.css']
})
export class HeaderCdComponent implements OnInit {

  companyId: string | null = null;
  companyData: any = null;

  constructor(
    private route: ActivatedRoute,
    private companyService: CompanyService,
    private sidebarService: SidebarService,
    private userService: UserService,
  ) { }

  notifications: any[] = [];
  invitations: any[] = [];
  joins: any[] = [];
  offerings: any[] = []; 
  joinToCompanies: any[] = [];
  currentUserId: any;

  isDropdownOpen = false;
  isNotifications = false;
  isActiveNotifications = false;

  ngOnInit(): void {
    this.companyId = this.route.snapshot.paramMap.get('id');
    if (this.companyId) {
      this.loadCompanyData(this.companyId);
    }
    this.loadNotifications();
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

  deleteNotification(notificationId: number) {

  }

  loadCompanyData(id: string): void {
    this.companyService.getCompanyById(id).subscribe({
      next: (response) => {
        console.log('API Response:', response); 
        if (response.success) {
          this.companyData = response.company;
          console.log('Company Data:', this.companyData); 
        } else {
          console.error('Failed to load company data:', response);
        }
      },
      error: (error) => {
        console.error('Error loading company data:', error);
      }
    });
  } 
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  hideDropdown() {
    this.isDropdownOpen = false;
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  logout(): void {
    // Implementasikan logika logout di sini
  }
}
