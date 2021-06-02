import { Get } from '@nestjs/common';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { LoginUserDTO } from 'src/dto/login-user.dto';
import { TokenUserDTO } from 'src/dto/token-user.dto';
import { AuthService } from './auth.service';
//Proeject mới

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiInternalServerErrorResponse({ description: ' Authencation App Is Error' })
  @ApiCreatedResponse({ description: ' Created Token Success' })
  @Post('login')
  @Public()
  async loginAndRequestToken(@Body() user: LoginUserDTO) {
    return await this.authService.login(user);
  }

  @Get('getAListUserAndVerifyToken')
  async getListUserAndVerifyToken(
    @Body() token: TokenUserDTO,
  ): Promise<unknown> {
    return await this.authService.getListUserAndVerifyToken(token);
  }
}
