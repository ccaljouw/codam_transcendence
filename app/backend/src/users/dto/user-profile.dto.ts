import { IsOptional } from "class-validator";

export class UserProfileDto {

  @IsOptional()
  loginName: string;

  @IsOptional()
  userName: string;

  @IsOptional()
  email: string;

  @IsOptional()
  firstName: string;

  @IsOptional()
  lastName: string;

  @IsOptional()
  avatarId: number;

  @IsOptional()
  online: number;
}