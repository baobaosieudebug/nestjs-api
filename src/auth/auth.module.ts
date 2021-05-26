import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './stratery/local.stratery';
import { JwtStrategy } from './stratery/jwt.stratery';
import { AuthController } from './auth.controller';
import { JwtConfigService } from './service/jwt.config.service';
import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
    ConfigModule.forRoot(),
    PassportModule,
    UsersModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
