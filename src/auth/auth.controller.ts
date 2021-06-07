import { Get, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import path = require('path');
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { Observable } from 'rxjs';
import { Public } from 'src/decorators/public.decorator';
import { LoginUserDTO } from 'src/dto/login-user.dto';
import { TokenUserDTO } from 'src/dto/token-user.dto';
import { AuthService } from './auth.service';

import * as uuidv4 from 'uuidv4';
//Proeject mới

export const storage = {
  storage: diskStorage({
    destination: './upload',
    filename: (req, file, cb) => {
      const filename: string = path
        .parse(file.originalname)
        .name.replace(/\s/g, '');
      const extension: string = path.parse(file.originalname).ext;

      cb(null, `${filename}${extension}`);
    },
  }),
};
import * as dotenv from 'dotenv';
import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import * as util from 'util';
const readFile = util.promisify(fs.readFile);
const BUCKET_NAME = 'abcd';
dotenv.config();
const s3 = new AWS.S3({
  region: process.env.AWS_BUCKET_REGION,
  secretAccessKey: process.env.AWS_S3_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
});
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
  async getListUserAndVerifyToken(@Body() user: LoginUserDTO) {
    return await this.authService.getListUserAndVerifyToken(user);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 1024 * 1024 * 2 } }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    const response = {
      originalname: file.originalname,
      filename: file.filename,
    };
    return response;
  }

  @Post('uploadimg')
  @UseInterceptors(FileInterceptor('file', storage))
  uploadFileImg(@UploadedFile() file) {
    return { imagePath: file.path };
  }
}
