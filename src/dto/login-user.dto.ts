import { ApiProperty } from '@nestjs/swagger';
import { Length, IsEmail, IsDefined, IsNotEmpty } from 'class-validator';

export class LoginUserDTO {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @Length(4, 20)
  @IsNotEmpty()
  password: string;
}
