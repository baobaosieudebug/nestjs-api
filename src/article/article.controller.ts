import { Get, Put } from '@nestjs/common';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { CreateArticleDTO } from 'src/dto/create-article.dto';
import { EditAddressDTO } from 'src/dto/edit-address.dto';
import { EditArticleDTO } from 'src/dto/edit-article.dto';
import { LoginUserDTO } from 'src/dto/login-user.dto';
import { ArticleService } from './artice.service';
import { ArticleEntity } from './article.entity';

//Proeject mới
@ApiTags('Article')
@ApiBearerAuth()
@Controller('article')
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @Public()
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
  async createArticle(@Body() article: CreateArticleDTO) {
    return await this.articleService.createArticle(article);
  }

  @Public()
  @Put()
  async editArticle(@Body() article: EditArticleDTO) {
    return await this.articleService.editArticle(article);
  }
}
