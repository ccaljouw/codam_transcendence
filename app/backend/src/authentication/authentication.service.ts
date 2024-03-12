import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {

  getAuthorizationUrl(): string {
    return `https://api.intra.42.fr/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}&response_type=code&scope=${process.env.SCOPE}&state=${process.env.STATE}`;
  }

  handleCallback(code: string): void {
    // Logic to exchange the authorization code for an access token
    const token = this.exchangeCodeForToken(code);
    // Additional logic (e.g., store token, fetch user data, etc.)
  }

  private exchangeCodeForToken(code: string): string {
    // Implement the OAuth token exchange logic here
    return 'your_access_token';
  }
}
