import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateBookmarkDto {
  @IsNotEmpty()
  @ApiProperty({ uniqueItems: true, nullable: false })
  title: string;

  @MaxLength(100)
  @IsOptional()
  @ApiProperty({ required: false })
  descritpion: string;

  @MaxLength(100)
  @ApiProperty({ nullable: false })
  link: string;

  @IsNotEmpty()
  @ApiProperty({ nullable: false })
  ownerId: number;
}
