import { ApiProperty } from '@nestjs/swagger';
import { Length, IsEmail } from 'class-validator';

export class LoginUserDTO {
  @ApiProperty({
    type: String,
    example: 'example@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String, example: 'example' })
  @Length(4, 20)
  password: string;
}
