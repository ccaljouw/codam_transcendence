import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationController } from '../controllers/authentication.controller';
import { AuthenticationService } from '../services/authentication.service';
import { MockAuthenticationService } from './authentication.service.spec';

export class MockAuthenticationController {}

describe('AuthenticationController', () => {
  let controller: AuthenticationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        {
          provide: AuthenticationService,
          useClass: MockAuthenticationService,
        },
      ],
    }).compile();

    controller = module.get<AuthenticationController>(AuthenticationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
