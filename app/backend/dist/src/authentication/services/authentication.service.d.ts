import { CreateAuthenticationDto } from '../dto/create-authentication.dto';
import { UsersService } from '../../database/users/users.service';
import { AuthenticationEntity } from '../dto/authentication.entity';
export declare class AuthenticationService {
    private users;
    constructor(users: UsersService);
    register(createAuthenticationDto: CreateAuthenticationDto): Promise<AuthenticationEntity>;
}
