import { Length, IsEmail, IsDefined, IsNotEmpty } from 'class-validator';

export class LoginUserDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Length(4, 20)
  @IsNotEmpty()
  password: string;
}
