import {
  Controller,
  Body,
  Param,
  Get,
  Post,
  Patch,
  Delete,
} from '@nestjs/common';
import { AuthenticationService } from '../services/authentication.service';
import { CreateAuthenticationDto } from '../dto/create-authentication.dto';
import { UpdateAuthenticationDto } from '../dto/update-authentication.dto';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticationEntity } from '../dto/authentication.entity';

@Controller('authentication')
@ApiTags('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  @ApiCreatedResponse({ type: AuthenticationEntity })
  register(@Body() createAuthenticationDto: CreateAuthenticationDto) {
    return this.authenticationService.register(createAuthenticationDto);
  }

  //TODO: login

  //TODO: logout

  //TODO: refresh
}
