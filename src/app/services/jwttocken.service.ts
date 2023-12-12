import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable()
export class JWTTokenService {
    decodedToken !: string;

    constructor() {
        
    };

    decodeToken(jwtToken : string) {
        if (jwtToken) {
            this.decodedToken = jwtDecode(jwtToken);
        }
    }

    getUser(jwtToken : string) {
        const decodedToken: any = this.decodeToken(jwtToken);
        const username = decodedToken.Username;
        return username;
    }

    getEmailId(jwtToken : string) {
        const decodedToken: any = this.decodeToken(jwtToken);
        const role = decodedToken.Role;
        return role;
    }

    getRole(jwtToken : string) {
        const decodedToken: any = this.decodeToken(jwtToken);
        const email = decodedToken.Email;
        return email;
    }

    isTokenExpired(): boolean {
        return false;
    }
}