import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  //ini buat cek si user statusnya sudah bercompany atau
  getUserCompanyStatus(): Observable<{ status: boolean }> {
    return this.http.get<{ status: boolean }>(`${this.apiUrl}/api/user/status`);
  }
  getCurrentUser(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/user`);
  }
}
