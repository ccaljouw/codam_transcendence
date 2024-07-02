import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'
import { AuthService } from './authentication.service';
import { AuthController } from './authentication.controller';
import { UsersService } from 'src/users/users.service';
import { DatabaseModule } from 'src/database/database.module';
import { PassportModule } from '@nestjs/passport';
import { StrategyFortyTwo } from './strategy/42.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StatsService } from 'src/stats/stats.service';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from './strategy/login.strategy';

@Module({
  imports: [UsersModule, PassportModule, DatabaseModule, HttpModule, JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      secret: configService.get('JWT_SECRET'),
      signOptions: {expiresIn: '60m'},
    })
  })],
  controllers: [AuthController],
  providers: [AuthService, UsersService, StrategyFortyTwo, JwtStrategy, LocalStrategy, StatsService],
  exports: [AuthService]
})
export class AuthenticationModule {}