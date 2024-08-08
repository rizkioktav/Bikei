import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUserCompanies(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/user/companies`);
  }
  getCompanyById(id: string): Observable<any> {
    const url = `${this.apiUrl}/api/user/company/${id}`; 
    return this.http.get<any>(url);
  }
  getCompanyMembers(id: string): Observable<any> {
    const url = `${this.apiUrl}/api/company/${id}/members`;
    return this.http.get<any>(url);
  }
  createCompany(companyData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/company/create`, companyData);
  }
  joinByToken(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/company/join-by-token`, data);
  }
  inviteUser(companyId: string, inviteData:any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/company/${companyId}/invite`, inviteData);
  }
  transferOwnership(companyId:string, transferOwnershipData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/company/${companyId}/transfer-ownership`, transferOwnershipData );
  }
  generateToken(companyId: string) {
    return this.http.post(`${this.apiUrl}/api/company/generate-token/${companyId}`, {});
  }
  getTokens(companyId: string) {
    return this.http.get(`${this.apiUrl}/api/company/tokens/${companyId}`);
  }
  getNotifications(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/company/notifications`);
  }
  respondToInvitation(notificationId: number, response: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/company/notifications/respond-invitation`, { notification_id: notificationId, response });
  }
  respondToJoinRequest(notificationId: number, response: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/company/notifications/respond-to-join`, { notification_id: notificationId, response });
  }
  deleteNotification(notificationId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/company/notifications/${notificationId}`);
  }
}
