import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestService } from './app.service';
import { TestEntity } from './app.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
	TypeOrmModule.forRoot({ 
	type: 'postgres',
	 host: 'db',
	 port: 5432,
	 username: 'postgres',
	 password: 'postgres', 
	database: 'postgres',
	 entities: [], 
	synchronize: false,
	 autoLoadEntities: true, 
	}),
	TypeOrmModule.forFeature([TestEntity])
	],
  controllers: [AppController],
  providers: [AppService, TestService],
})
export class AppModule {}
