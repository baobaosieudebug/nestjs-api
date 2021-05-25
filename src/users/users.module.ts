import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersEntity } from './users.entity';
import { AddressModule } from './address/address.module';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity]), AddressModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
