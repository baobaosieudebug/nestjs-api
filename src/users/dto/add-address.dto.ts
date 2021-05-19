import { IsNumber, isString, IsString } from 'class-validator';

export class AddAddressDTO {
  @IsNumber()
  idUser: number;

  @IsString()
  nameAddress: string;

  @IsString()
  street: string;

  @IsString()
  ward: string;

  @IsString()
  district: string;

  @IsString()
  city: string;
}
