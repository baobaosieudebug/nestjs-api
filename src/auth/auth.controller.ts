import {
  BadRequestException,
  Get,
  HttpException,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import path = require('path');
import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import { Public } from '../decorators/public.decorator';
import { LoginUserDTO } from '../user/dto/login-user.dto';
import { AuthService } from './auth.service';
import { awsConfig } from '../config/aws.config';
import { storage } from '../config/storage.config';
import { RegisterUserDTO } from '../user/dto/register-user.dto';
import { Payload } from '../decorators/payload.decorator';

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

  @Public()
  @UsePipes(ValidationPipe)
  @Post('register')
  async register(@Body() user: RegisterUserDTO) {
    return await this.authService.register(user);
  }

  @Public()
  @Post('login')
  async login(@Body() user: LoginUserDTO) {
    return await this.authService.login(user);
  }

  @Post('role')
  async addRole(@Payload() payload, @Body() data) {
    return await this.authService.addRole(payload, data);
  }

  async uploadToS3(@UploadedFile() file: Express.Multer.File) {
    const filePath = path.resolve(`D:/intern/get-started-project/upload`, file.originalname);
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

  @Post('uploadFileToS3')
  @UseInterceptors(FileInterceptor('file', storage))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    const filePath = path.resolve(__dirname, '1113.jpg');
    const fileStream = fs.createReadStream(filePath);
    const fileName = file.originalname;
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
    // this.uploadToS3(file);
    throw new HttpException('Upload File Successfully!', HttpStatus.OK);
  }

  @Post('uploadImgToS3')
  @UseInterceptors(FileInterceptor('file', storage))
  async uploadImg(@UploadedFile() file) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      throw new BadRequestException('Only images file is allowed!');
    } else {
      await this.uploadToS3(file);
      throw new HttpException('Upload  Image Successfully!', HttpStatus.OK);
    }
  }

  @Get('signUrl')
  @UseInterceptors(FileInterceptor('file'))
  async signUrlFromS3(@UploadedFile() file: Express.Multer.File) {
    const now = new Date();
    const fileName = `updated-at:${now.toISOString()} ` + file.originalname;
    const fileType = file.mimetype;
    const s3Params = {
      Bucket: awsConfig.BUCKET,
      Key: fileName,
      Expires: 300,
      ContentType: fileType,
      ACL: 'public-write',
    };
    const url = s3client.getSignedUrl('putObject', s3Params);
    return url;
  }

  @Get('readFileFromS3')
  async readFileFromS3() {
    const getParams = {
      Bucket: awsConfig.BUCKET, // your bucket name,
      Key: 'updated-at:2021-06-10T01:57:29.153Z 1111.jpg', // path to the object you're looking for
    };
    const data = await s3client.getObject(getParams).promise();

    // Check for image payload and formats appropriately
    if (data.ContentType === 'image/jpeg') {
      return data.Body.toString('base64');
    } else {
      return data.Body.toString('utf-8');
    }
  }
  catch(e) {
    throw new Error(`Could not retrieve file from S3: ${e.message}`);
  }
}
