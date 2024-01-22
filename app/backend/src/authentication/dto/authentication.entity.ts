import { ApiProperty } from '@nestjs/swagger';

export class AuthenticationEntity {
  @ApiProperty()
  id: number;

  @ApiProperty({ uniqueItems: true, nullable: false })
  email: string;

  @ApiProperty({ required: false })
  firstName: string;

  @ApiProperty({ required: false })
  lastName: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
