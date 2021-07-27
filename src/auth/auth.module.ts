import { HttpModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { ConfigModule } from '../config/config.module';
import { MulterModule } from '@nestjs/platform-express/multer';
import { OrganizationModule } from '../organization/organization.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionRepository } from './repository/permission.repository';
import { ActionRepository } from './repository/action.repository';
import { ResourceRepository } from './repository/resource.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([PermissionRepository, ActionRepository, ResourceRepository]),
    PassportModule,
    UserModule,
    OrganizationModule,
    ConfigModule.forRoot(),
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: './upload',
      }),
    }),
    JwtModule.register({
      secret: 'SECRET',
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
