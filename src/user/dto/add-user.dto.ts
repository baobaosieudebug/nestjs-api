import { ApiProperty } from '@nestjs/swagger';
import { Length, IsEmail } from 'class-validator';

export class AddUserDTO {
  @ApiProperty({ type: String, example: 'John Zoe Mark' })
  @Length(10, 20)
  name: string;

  @ApiProperty({ type: String, example: 'Johnzoe@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String, example: '4pumn!fcv6' })
  @Length(10, 20)
  password: string;
}
