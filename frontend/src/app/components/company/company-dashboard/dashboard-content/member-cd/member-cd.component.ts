import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CompanyService } from '../../../../../services/services-company/company.service';

@Component({
  selector: 'app-member-cd',
  templateUrl: './member-cd.component.html',
  styleUrls: ['./member-cd.component.css']
})
export class MemberCdComponent implements OnInit {
  newRoleName: string = '';

  companyId: string | null = null;
  tokens: string[] = [];
  // members: any = null;
  companyData: any = null;

  inviteData = {
    identifier: '',
    id_role: null,
  };

  transferOwnershipData = {
    target_identifier: '',
    new_id_role: null,
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
  generatedToken: string = '';

  isAksiModal: boolean = false;
  isPindahOwnerModal: boolean = false;
  isTambahKaryawanModal: boolean = false;
  isAturJabatanModal: boolean = false;
  isGenerateTokenModal: boolean = false;
  isTokenListVisible = false;

  constructor(
    private companyService: CompanyService,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.companyId = this.route.parent?.snapshot.paramMap.get('id') ?? null;
    if (this.companyId) {
      this.loadCompanyData(this.companyId);
      this.loadTokens(this.companyId);
    }
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

  toggleAksiModal() {
    this.isAksiModal = !this.isAksiModal;
  }

  hideAksiModal() {
    this.isAksiModal = false;
  }

  showPindahOwnerModal() {
    this.isPindahOwnerModal = true;
    this.isAksiModal = false;
  }

  hidePindahOwnerModal() {
    this.isPindahOwnerModal = false;
  }

  showTambahKaryawanModal() {
    this.isTambahKaryawanModal = true;
    this.isAksiModal = false;
  }

  hideTambahKaryawanModal() {
    this.isTambahKaryawanModal = false;
  }

  showAturJabatanModal() {
    this.isAturJabatanModal = true;
    this.isAksiModal = false;
  }

  hideAturJabatanModal() {
    this.isAturJabatanModal = false;
  }

  showGenerateTokenModal() {
    this.isGenerateTokenModal = true;
    this.isAksiModal = false;
  }

  hideGenerateTokenModal() {
    this.isGenerateTokenModal = false;
  }

  showTokenList() {
    this.isTokenListVisible = true;
  }

  hideTokenList() {
    this.isTokenListVisible = false;
  }

  addRole() {
    if (this.newRoleName.trim()) {
      if (!this.roles.find(role => role.role === this.newRoleName.trim())) {
        const newId = this.roles.length ? Math.max(...this.roles.map(r => r.id)) + 1 : 1;
        this.roles.push({ id: newId, role: this.newRoleName.trim() });
        this.newRoleName = '';
      } else {
        alert('Jabatan sudah ada');
      }
    }
  }

  removeRole(role: string) {
    this.roles = this.roles.filter(r => r.role !== role);
  }

  // loadCompanyMembers(id: string): void {
  //   this.companyService.getCompanyMembers(id).subscribe({
  //     next: (response) => {
  //       if (response.success) {
  //         this.members = response.members;
  //       } else {
  //         console.error('Failed to load company members:', response.message);
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Error loading company members:', error);
  //     }
  //   });
  // }

  submitForm() {
    console.log('Daftar Jabatan:', this.roles);
  }
  
  submitInvite(): void {
    if (!this.companyId) {
      alert('Company ID is not available');
      return;
    }

    this.companyService.inviteUser(this.companyId, this.inviteData).subscribe(
      response => {
        alert('Invitation sent successfully');
      },
      error => {
        console.error('Error details:', error);
        alert('Error sending invitation');
      }
    );
  }

  submitTransferOwnership() {
    if (!this.companyId) {
      alert('Company ID is not available');
      return;
    }
    this.companyService.transferOwnership(this.companyId, this.transferOwnershipData)
      .subscribe(response => {
        this.hidePindahOwnerModal();
        alert('Transfer Ownership berhasil');
      }, error => {
        console.error('Error transfer ownership:', error);
      });
  }

  generateToken() {
    const companyId = this.route.parent?.snapshot.paramMap.get('id') ?? null;
    if (companyId) {
      this.companyService.generateToken(companyId).subscribe(
        (response: any) => {
          if (response.success) {
            this.generatedToken = response.token;
            this.loadTokens(companyId); // Muat ulang daftar token setelah generate
            this.isTokenListVisible = true; // Tampilkan list token
          } else {
            console.error('Failed to generate token:', response.message);
          }
        },
        (error) => {
          console.error('Error generating token:', error);
        }
      );
    } else {
      console.error('Company ID is not available.');
    }
  }  

  loadTokens(companyId: string) {
    this.companyService.getTokens(companyId).subscribe(
      (response: any) => {
        if (response.success) {
          this.tokens = response.tokens;
        } else {
          console.error('Failed to load tokens:', response.message);
        }
      },
      (error) => {
        console.error('Error loading tokens:', error);
      }
    );
  }
}