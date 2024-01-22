import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { MockPrismaService } from '../../prisma/tests/prisma.service.spec';
import { PrismaService } from '../../prisma/prisma.service';

// create a mock of this service for use in other tests
export class MockUsersService {}

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useClass: MockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
