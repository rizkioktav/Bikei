import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private apiUrl = environment.apiUrl;

  constructor() {
    console.log('TokenService initialized with apiUrl:', this.apiUrl);
  }

  handle(token: string) {
    this.set(token);
    console.log('Token received and set:', token);
    console.log('Token is valid:', this.isValid());
  }

  set(token: string) {
    console.log('Setting token:', token);
    sessionStorage.setItem('token', token);
    localStorage.setItem('token', token);
    console.log('Token set successfully in storage');
  }

  get(): string | null {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    console.log('Getting token:', token);
    return token;
  }

  remove() {
    console.log('Removing token:', this.get());
    sessionStorage.removeItem('token');
    localStorage.removeItem('token');
    console.log('Token removed');
  }

  isValid(): boolean {
    const token = this.get();
    if (token) {
      try {
        const payload = this.payload(token);
        console.log('Payload:', payload);
        console.log('apiUrl:', this.apiUrl);
        if (payload) {
          const isValid = (payload.iss === `${this.apiUrl}/api/login` || payload.iss === `${this.apiUrl}/auth/google/callback`);
          console.log('Payload.iss:', payload.iss);
          console.log('isValid:', isValid);
          return isValid;
        }
      } catch (error) {
        console.error('Token decoding error', error);
      }
    }
    return false;
  }

  payload(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      console.log('Token payload:', decodedPayload);
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Payload extraction error', error);
      return null;
    }
  }

  decode(payload: string): any {
    try {
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error('Token decoding error', error);
      return null;
    }
  }

  loggedIn(): boolean {
    return this.isValid();
  }
}
