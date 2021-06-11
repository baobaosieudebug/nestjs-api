import { ApiProperty } from '@nestjs/swagger';
import { Length, IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDTO {
  @ApiProperty({
    type: String,
    example: 'Nguyenthuyduy123@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ type: String, example: 'baobao123' })
  @Length(4, 20)
  @IsNotEmpty()
  password: string;
}
