import { ApiProperty } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";

export class RegisterUserDto {
  @ApiProperty({ type: CreateUserDto })
  createUser: CreateUserDto;

  @ApiProperty({ example: 'strongPassword123' })
  pwd: string;
}