import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeRepository } from './type.repository';
import { TypeService } from './type.service';
import { TypeController } from './type.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TypeRepository])],
  providers: [TypeService],
  controllers: [TypeController],
  exports: [TypeService],
})
export class TypeModule {}
