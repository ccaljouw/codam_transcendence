import { Injectable } from '@nestjs/common';
import { UserProfileDto, CreateUserDto } from '@ft_dto/users';
import { UsersService } from 'src/users/users.service';
import { HttpService } from '@nestjs/axios'
import { AxiosResponse } from 'axios'
import { Observable, lastValueFrom, map } from 'rxjs';
import { PrismaService } from 'src/database/prisma.service';
import { Create42TokenDto } from '@ft_dto/authentication/create-token.dto';

@Injectable()
export class AuthService {

  constructor (
    private readonly userService: UsersService, 
    private readonly httpService: HttpService,
    private readonly db: PrismaService,
  ) {};

  getAuthorizationUrl(): string {
    const auth_url: string = `https://api.intra.42.fr/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}&response_type=code&scope=${process.env.SCOPE}&state=${process.env.STATE}`;
    console.log(auth_url);
    return auth_url;
  }

  async exchangeCodeForToken(code: string) : Promise<Observable<AxiosResponse<any>>>{
    console.log("code: ", code);
    const formData = new FormData();
    formData.append('grant_type', process.env.GRANT_TYPE);
    formData.append('client_id', process.env.CLIENT_ID);
    formData.append('client_secret', process.env.SECRET);
    formData.append('code', code);
    formData.append('redirect_uri', process.env.REDIRECT_URI);
    formData.append('state', process.env.STATE)

    try {
      const token42 = await lastValueFrom(this.httpService.post('https://api.intra.42.fr/oauth/token', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }))
      console.log('Response data:', token42.data);
      return token42.data;
    }
    catch(error) {
      console.error('Error sending POST request to exchange token:', error);
      throw error;
    }
  }

  private get42User(token42: string) {

  }

  async callback(code: string) : Promise<UserProfileDto> {
    console.log("authentication callback: ", code);
    let token42 = await this.exchangeCodeForToken(code);
    console.log("token received: ", token42);
    // this.db.token42.create(token42) 
    //  store token in db
    // const user42 = this.get42User(token42); // move to userservice?
    //  create new transcendence user
    return this.userService.findOne(1); //change
  }
}
