import { ApiProperty } from '@nestjs/swagger';
import { Length, IsEmail } from 'class-validator';

export class RegisterUserDTO {
  @ApiProperty({
    type: String,
    example: 'example@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String, example: '4puma!fcv6' })
  @Length(10, 20)
  password: string;

  @ApiProperty({ type: String, example: 'JohnZoeMark' })
  @Length(10, 20)
  username: string;
}
