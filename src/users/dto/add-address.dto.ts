import { IsNumber, isString, IsString } from 'class-validator';

export class AddAddressDTO {
  @IsNumber()
  userCreatead: number;

  @IsString()
  nameAddress: string;

  @IsString()
  ward: string;

  @IsString()
  district: string;

  @IsString()
  city: string;
}
