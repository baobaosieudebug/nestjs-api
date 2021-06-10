import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CaslModule } from 'src/article/casl/casl.module';
import { UserRepository } from 'src/repo/user.repository';
import { GroupRepository } from 'src/repo/group.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository]), HttpModule, CaslModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
