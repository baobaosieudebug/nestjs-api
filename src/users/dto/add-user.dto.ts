import { ApiProperty } from '@nestjs/swagger';
import { Length, IsEmail, IsDefined, IsNotEmpty } from 'class-validator';

export class AddUserDTO {
  @ApiProperty()
  @Length(10, 20)
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @Length(4, 20)
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  isAdmin: boolean;
}
