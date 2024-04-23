import { Injectable } from '@nestjs/common';
import { UserProfileDto, CreateUserDto } from '@ft_dto/users';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {

  constructor (private readonly userService: UsersService) {};

  getAuthorizationUrl(): string {
    const auth_url: string = `https://api.intra.42.fr/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}&response_type=code&scope=${process.env.SCOPE}&state=${process.env.STATE}`;
    console.log(auth_url);
    return auth_url;
  }

  async handleCallback(code: string): Promise<UserProfileDto> {
    console.log("Callback function called");
    
    // Logic to exchange the authorization code for an access token
    const token = this.exchangeCodeForToken(code);
    console.log("Token: ", token);
    
    // get userinfo 42
    const user : CreateUserDto = { loginName: 'newUser' , hash: 'ajsgfjha' };
    
    // create new user and return userProfile
    return await this.userService.create(user);
  }

  private exchangeCodeForToken(code: string): string {

    // Implement the OAuth token exchange logic here

    return 'your_access_token';
  }

  async get42User(code: string) {
    return this.userService.findOne(1); //change
  }
}
