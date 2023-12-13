import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '../models/jwt-token.model';

@Injectable()
export class JWTTokenService {
    decodedToken : DecodedToken | null = null;

    constructor() {
        
    };

    decodeToken(jwtToken: string): DecodedToken | null {
        try {
            if (jwtToken) {
                this.decodedToken = jwtDecode(jwtToken);
                return this.decodedToken as DecodedToken;
            }
            return null;
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    }
    

    getUser(jwtToken: string): string {
        const decodedToken = this.decodeToken(jwtToken);
        const userName = decodedToken ? decodedToken.userName : '';
        return userName.toString();
    }
    

    getEmailId(jwtToken: string): string {
        const decodedToken = this.decodeToken(jwtToken);
        return decodedToken ? decodedToken.email : '';
    }
    
    getRole(jwtToken: string): string {
        const decodedToken = this.decodeToken(jwtToken);
        return decodedToken ? decodedToken.roleName : '';
    }

    isTokenExpired(): boolean {
        return false;
    }
}