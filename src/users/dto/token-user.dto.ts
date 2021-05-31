import { IsNotEmpty } from 'class-validator';

export class TokenUserDTO {
  @IsNotEmpty()
  token: string;
}
