import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompanyService } from '../../../../services/services-company/company.service';
import { SidebarService } from '../../../../services-ui/sidebar.service';


@Component({
  selector: 'app-sidebar-cd',
  templateUrl: './sidebar-cd.component.html',
  styleUrls: ['./sidebar-cd.component.css']
})
export class SidebarCdComponent {
  companyId: string | null = null;
  companyData: any = null;

  isOpen = false;

  constructor(
    private route: ActivatedRoute,
    private companyService: CompanyService,
    private sidebarService: SidebarService
  ) { }

  ngOnInit(): void {
    this.companyId = this.route.snapshot.paramMap.get('id');
    if (this.companyId) {
      this.loadCompanyData(this.companyId);
    }
    this.sidebarService.sidebarOpen$.subscribe(isOpen => {
      this.isOpen = isOpen;
    });
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
}
