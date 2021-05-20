import { Length, IsEmail, IsDefined, IsNotEmpty } from 'class-validator';

export class AddUserDTO {
  @Length(10, 20)
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Length(4, 20)
  @IsNotEmpty()
  password: string;
}
