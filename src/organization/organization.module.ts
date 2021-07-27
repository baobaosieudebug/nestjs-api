import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationRepository } from './organization.repository';
import { ProjectModule } from '../project/project.module';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrganizationRepository]),
    forwardRef(() => ProjectModule),
    forwardRef(() => UserModule),
    JwtModule.register({
      secret: 'SECRET',
      signOptions: { expiresIn: '60s' },
    }),
    MailModule,
  ],
  providers: [OrganizationService],
  controllers: [OrganizationController],
  exports: [OrganizationService, TypeOrmModule],
})
export class OrganizationModule {}
