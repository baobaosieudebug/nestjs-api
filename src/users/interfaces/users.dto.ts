import { Length, IsEmail, IsDefined } from 'class-validator';

export class UsersDTO {
  @Length(10, 20)
  @IsDefined()
  name: string;

  @IsEmail()
  @IsDefined()
  email: string;

  @Length(4, 20)
  password: string;
}
