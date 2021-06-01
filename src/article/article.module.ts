import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleService } from './artice.service';
import { ArticleController } from './article.controller';
import { ArticleEntity } from './article.entity';
import { CaslModule } from './casl/casl.module';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity]), CaslModule],
  providers: [ArticleService],
  controllers: [ArticleController],
  exports: [ArticleService],
})
export class ArticleModule {}
