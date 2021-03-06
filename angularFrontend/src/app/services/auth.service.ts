import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  isAuth(): boolean {
    return !!sessionStorage.getItem('tkn');
  }

  getToken() {
    return sessionStorage.getItem('tkn');
  }
}
