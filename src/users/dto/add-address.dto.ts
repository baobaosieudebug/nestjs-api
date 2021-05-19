import { IsNumber, IsString } from 'class-validator';

export class AddAddressDTO {
  @IsNumber()
  userId: number;

  @IsString()
  street: string;

  @IsString()
  ward: string;

  @IsString()
  district: string;

  @IsString()
  city: string;
}
