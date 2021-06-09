import {
  BadRequestException,
  Get,
  HttpException,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Body, Controller, Post } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import path = require('path');
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { LoginUserDTO } from 'src/dto/login-user.dto';
import { AuthService } from './auth.service';
import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import { awsConfig } from '../config/aws.config';
import { storage } from '../config/storage.config';

const credentials = {
  accessKeyId: awsConfig.AWS_ACCESS_ID,
  secretAccessKey: awsConfig.AWS_SECRET_KEY,
};
const useLocal = process.env.NODE_ENV !== 'production';

const s3client = new AWS.S3({
  credentials,
  endpoint: useLocal ? 'http://localhost:4566' : undefined,
  s3ForcePathStyle: true,
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

  @Post('uploadS3')
  @UseInterceptors(FileInterceptor('file'))
  async upFileToS3(@UploadedFile() file: Express.Multer.File) {
    // const filePath = path.resolve(__dirname + `/upload`, file.originalname);
    const filePath = path.resolve(
      `D:/intern/get-started-project/upload`,
      file.originalname,
    );
    const fileStream = fs.createReadStream(filePath);
    const now = new Date();
    const fileName = `updated-at:${now.toISOString()} ` + file.originalname;
    s3client.upload(
      {
        Bucket: awsConfig.BUCKET,
        Key: fileName,
        Body: fileStream,
      },
      (err, response) => {
        if (err) throw err;
        return response;
      },
    );
  }

  @Post('uploadImg')
  @UseInterceptors(FileInterceptor('file', storage))
  uploadFileImg(@UploadedFile() file) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      throw new BadRequestException('Only images file is allowed!');
    } else {
      this.upFileToS3(file);
      throw new HttpException('Upload  Image Successfully!', HttpStatus.OK);
    }
  }

  @Get('signS3')
  @UseInterceptors(FileInterceptor('file'))
  async signS3(@UploadedFile() file: Express.Multer.File) {
    const now = new Date();
    const fileName = `updated-at:${now.toISOString()} ` + file.originalname;
    const fileType = file.mimetype;
    const s3Params = {
      Bucket: awsConfig.BUCKET,
      Key: fileName,
      Expires: 60,
      ContentType: fileType,
      ACL: 'public-write',
    };
    const url = s3client.getSignedUrl('putObject', s3Params);
    return url;
  }
}
