import { IsEnum, IsInt, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { InviteStatus, InviteType } from "@prisma/client";

export class CreateInviteDto {

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ required: true, type: Number })
  chatId: number;
  
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ required: true, type: Number })
  senderId!: number;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ required: true, type: Number })
  recipientId: number;
  
  @IsNotEmpty()
  @IsEnum(InviteType)
  @ApiProperty({ required: true, enum: InviteType })
  type:     InviteType;

  @IsEnum(InviteStatus)
  @ApiProperty({ required: false, enum: InviteStatus, default: InviteStatus.SENT })
  state?: InviteStatus

  @ApiProperty({ required: false, type: Date })
  expiredAt?: Date;
}