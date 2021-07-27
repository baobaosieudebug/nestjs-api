// import { MailerService } from '@nestjs-modules/mailer';
// import { BadRequestException, Injectable } from '@nestjs/common';
// import 'dotenv/config';
// import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';
// import { UserRepository } from '../user/repository/user.repository';
// import { ConfigService } from '../config/config.service';
//
// export interface SendMailData {
//   to: string;
//   subject: string;
//   template: string;
//   context: Record<string, any>;
// }
//
// @Injectable()
// export class MailService {
//   private algorithm = 'aes-256-cbc';
//   private pepper = 'superSecretPepper';
//   constructor(
//     private readonly config: ConfigService,
//     private mailerService: MailerService,
//     private readonly userRepo: UserRepository,
//   ) {}
//
//   encryptCipheriv(data) {
//     const iv = randomBytes(16);
//     const key = createHash('sha256').update(this.pepper).digest('base64');
//     const cipher = createCipheriv(this.algorithm, key.substring(0, 32), iv);
//     let token = cipher.update(JSON.stringify(data));
//     token = Buffer.concat([token, cipher.final()]);
//     return `${iv.toString('hex')}$:${token.toString('hex')}`;
//   }
//
//   decryptCipheriv(hash) {
//     const parts = hash.split(':');
//     const iv = Buffer.from(parts.shift(), 'hex');
//     const tokenBody = Buffer.from(parts.join(':'), 'hex');
//     const key = createHash('sha256').update(this.pepper).digest('base64');
//     const decipher = createDecipheriv(this.algorithm, key.substring(0, 32), iv);
//     let decrypted = decipher.update(tokenBody);
//     decrypted = Buffer.concat([decrypted, decipher.final()]);
//     return JSON.parse(decrypted.toString());
//   }
//
//   async sendMail(data: SendMailData) {
//     const context = { ...data.context };
//     context.frontendUrl = this.config.get('frontendUrl');
//     return await this.mailerService.sendMail({
//       to: data.to,
//       from: 'no-reply@lander.com',
//       subject: data.subject,
//       template: data.template,
//       context: context,
//     });
//   }
//
//   async sendUserConfirmation(payload) {
//     // if (!payload.organizationCode) {
//     //   throw new BadRequestException('Organization not null');
//     // }
//     const userReceive = process.env.MAIl_USER;
//     // const isExistEmail = await this.userRepo.isExistEmail(userReceive);
//     // if (!isExistEmail) {
//     //   throw new BadRequestException('email not Exist');
//     // }
//     payload.userReceive = userReceive;
//     const token = this.encryptCipheriv(payload);
//     const url = `http://localhost:3001/api/v1/`;
//     await this.mailerService.sendMail({
//       to: userReceive,
//       from: payload.email, // sender address
//       subject: 'Welcome to Nice App! Confirm your Email',
//       template: './layout/invite-org',
//       context: {
//         name: payload.username,
//         userReceive: userReceive,
//         url,
//         token: token,
//       },
//     });
//   }
// }

import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { SentMessageInfo } from 'nodemailer';

export interface SendMailData {
  to: string;
  from: string;
  subject: string;
  template: string;
  context: Record<string, any>;
}

@Injectable()
export class MailService {
  constructor(private readonly config: ConfigService, private readonly mailerService: MailerService) {}

  async sendMail(data: SendMailData): Promise<SentMessageInfo> {
    const context = { ...data.context };
    return await this.mailerService.sendMail({
      to: data.to,
      from: data.from,
      subject: data.subject,
      template: data.template,
      context: context,
    });
  }
}
