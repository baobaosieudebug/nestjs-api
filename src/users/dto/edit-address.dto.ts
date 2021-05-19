import { IsNumber, IsString } from 'class-validator';

export class EditAddressDTO {
  @IsNumber()
  authorId: number;

  @IsString()
  nameAddress: string;

  @IsString()
  ward: string;

  @IsString()
  district: string;

  @IsString()
  city: string;
}
