import { AuthenticationService } from '../services/authentication.service';
import { CreateAuthenticationDto } from '../dto/create-authentication.dto';
import { AuthenticationEntity } from '../dto/authentication.entity';
export declare class AuthenticationController {
    private readonly authenticationService;
    constructor(authenticationService: AuthenticationService);
    register(createAuthenticationDto: CreateAuthenticationDto): Promise<AuthenticationEntity>;
}
