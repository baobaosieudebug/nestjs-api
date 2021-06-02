import { Delete, Get, Param, Put } from '@nestjs/common';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { get } from 'http';
import { PoliciesGuard } from 'src/auth/guards/policies.guard';
import { CheckPolicies } from 'src/decorators/checkpolicy.decorator';
import { Public } from 'src/decorators/public.decorator';
import { CreateArticleDTO } from 'src/dto/create-article.dto';
import { EditArticleDTO } from 'src/dto/edit-article.dto';
import { LoginUserDTO } from 'src/dto/login-user.dto';
import { Action } from './action/action.enum';
import { ArticleService } from './artice.service';
import { ArticleEntity } from './article.entity';
import { AppAbility } from './casl/casl-ability.factory';

//Proeject mới
@ApiTags('Article')
@Controller('article')
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @Public()
  @Get()
  @ApiOkResponse({ description: 'Get List Article Success' })
  async getAllArticle() {
    return await this.articleService.findAll();
  }

  @ApiOkResponse({ description: 'Get Article Success' })
  @ApiNotFoundResponse({ description: 'ID Article Not Found' })
  @Get(':id')
  async getArticleByIdOrFail(@Param('id') id: number) {
    return await this.articleService.getArticleByIdOrFail(id);
  }
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
  })
  @ApiUnauthorizedResponse({ description: 'You need to login ' })
  @Post()
  async createArticle(@Body() article: CreateArticleDTO) {
    return await this.articleService.createArticle(article);
  }

  @ApiOkResponse({ description: 'Get Article Success' })
  @ApiNotFoundResponse({ description: 'ID Article Not Found' })
  @Public()
  @Put(':id')
  async editArticle(@Body() article: EditArticleDTO, @Param('id') id: number) {
    return await this.articleService.editArticle(article, id);
  }

  @ApiOkResponse({ description: 'Get Article Success' })
  @ApiNotFoundResponse({ description: 'ID Article Not Found' })
  @Delete(':id')
  async removeArticle(@Param('id') id: number) {
    return await this.articleService.removeArticle(id);
  }
}
