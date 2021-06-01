import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, isString, IsString } from 'class-validator';

export class AddAddressDTO {
  @ApiProperty()
  @IsNumber()
  userCreatead: number;

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
