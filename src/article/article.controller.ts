import { Get } from '@nestjs/common';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { LoginUserDTO } from 'src/users/dto/login-user.dto';
import { ArticleService } from './artice.service';
import { ArticleEntity } from './article.entity';
//Proeject mới
@ApiTags('Article')
@Controller('article')
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  // @Public()
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: ArticleEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'You need to login at auth/login',
    type: LoginUserDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Sorry! Server is Updated.',
    type: ArticleEntity,
  })
  @Post()
  async createArticle(@Body() article: ArticleEntity) {
    return await this.articleService.createArticle(article);
  }
}
