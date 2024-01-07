import { Injectable } from '@nestjs/common';


import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestEntity } from './app.entity';

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(TestEntity)
    private testRepository: Repository<TestEntity>,
  ) {}

  async findAll(): Promise<TestEntity[]> {
    return this.testRepository.find();
  }

  // ... other methods for CRUD operations
}

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

// export class dbQuery(query: string)
// {

// }
