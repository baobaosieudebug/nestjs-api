import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { Request } from 'express';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { LocalStrategy } from './auth/local.stratery';
import { UsersService } from './users/users.service';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}
