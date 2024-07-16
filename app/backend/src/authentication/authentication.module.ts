import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'
import { AuthService } from './services/authentication.service';
import { AuthController } from './controllers/authentication.controller';
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
import { TwoFAService } from './services/2FA.service';
import { TwoFAController } from './controllers/2FA.controllers';

@Module({
  imports: [UsersModule, PassportModule, DatabaseModule, HttpModule, JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      secret: configService.get('JWT_SECRET'),
      //TODO: determine validity
      signOptions: {expiresIn: '60m'},
    })
  })],
  controllers: [AuthController, TwoFAController],
  providers: [AuthService, TwoFAService, UsersService, StrategyFortyTwo, JwtStrategy, LocalStrategy, StatsService],
  exports: [AuthService]
})
export class AuthenticationModule {}