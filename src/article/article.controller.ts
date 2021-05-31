import { Get } from '@nestjs/common';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';
import { ArticleService } from './artice.service';
import { ArticleEntity } from './article.entity';
//Proeject mới
@Controller('article')
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @Public()
  @Post()
  async createArticle(@Body() article: ArticleEntity) {
    return await this.articleService.createArticle(article);
  }
}
