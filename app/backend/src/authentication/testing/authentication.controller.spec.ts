import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../authentication.controller';
import { AuthService } from '../authentication.service';

describe('AuthenticationController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
