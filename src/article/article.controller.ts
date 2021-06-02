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

  // @UseGuards(PoliciesGuard)
  // @CheckPolicies((ability: AppAbility) =>
  //   ability.can(Action.Read, ArticleEntity),
  // )
  // @Public()
  @Get()
  async getAllArticle() {
    return await this.articleService.findAll();
  }
}
