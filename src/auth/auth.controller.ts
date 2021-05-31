import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Public()
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return await this.authService.validateUser(email, password);
  }
}
