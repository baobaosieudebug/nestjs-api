import {
  BadRequestException,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
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
import * as dotenv from 'dotenv';
import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import * as util from 'util';
import { imageFileFilter } from './exception filter/imagefile.filter';

const readFile = util.promisify(fs.readFile);
const BUCKET_NAME = 'abcd';
dotenv.config();
const s3 = new AWS.S3({
  region: process.env.AWS_BUCKET_REGION,
  secretAccessKey: process.env.AWS_S3_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
});

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
  limits: { fileSize: 50 },
};

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

  @Post('uploadFile')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 1024 * 1024 * 2 } }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    const response = {
      originalname: file.originalname,
      filename: file.filename,
    };
    throw new HttpException('Upload File Successfully!', HttpStatus.OK);
  }

  @Post('uploadImg')
  @UseInterceptors(FileInterceptor('file', storage))
  uploadFileImg(@UploadedFile() file) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      throw new BadRequestException('Only images file is allowed!');
    } else {
      const imagePath = file.path;
      throw new HttpException('Upload  Image Successfully!', HttpStatus.OK);
    }
  }
}
