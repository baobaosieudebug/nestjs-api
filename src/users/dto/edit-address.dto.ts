import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class EditAddressDTO {
  @ApiProperty()
  @IsNumber()
  authorId: number;

  @ApiProperty()
  @IsString()
  nameAddress: string;

  @ApiProperty()
  @IsString()
  ward: string;

  @ApiProperty()
  @IsString()
  district: string;

  @ApiProperty()
  @IsString()
  city: string;
}
