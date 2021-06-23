import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VersionRepository } from './version.repository';
import { VersionService } from './version.service';
import { VersionController } from './version.controller';

@Module({
  imports: [TypeOrmModule.forFeature([VersionRepository])],
  providers: [VersionService],
  controllers: [VersionController],
  exports: [VersionService],
})
export class VersionModule {}
