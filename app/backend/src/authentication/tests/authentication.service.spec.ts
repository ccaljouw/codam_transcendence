import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from '../services/authentication.service';
import { MockUsersService } from '../../database/users/tests/users.service.spec';
import { UsersService } from '../../database/users/users.service';

export class MockAuthenticationService {}

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        {
          provide: UsersService,
          useClass: MockUsersService,
        },
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
