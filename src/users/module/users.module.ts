import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from '../controller/users.controller';
import { UsersService } from '../service/users.service';
import { UserRepository } from 'src/users/repo/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository]), HttpModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
