import { ApiProperty } from '@nestjs/swagger';
import { Length, IsEmail, IsDefined, IsNotEmpty } from 'class-validator';

export class AddUserDTO {
  @ApiProperty({ type: String, example: 'John Zoe' })
  @Length(10, 20)
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: String, example: 'Johnzoe@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ type: String, example: 'baooilabao123' })
  @Length(4, 20)
  @IsNotEmpty()
  password: string;

  @ApiProperty({ type: Boolean, example: false })
  @IsNotEmpty()
  isAdmin: boolean;
}
