// import { Delete, Get, Param, Put } from '@nestjs/common';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TaskService } from './task.service';
// import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
// import { Public } from 'src/decorators/public.decorator';

//Proeject mới
@ApiTags('Task')
@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  //   @Public()
  //   @Get()
  //   @ApiOkResponse({ description: 'Get List Article Success' })
  //   async getAllArticle() {
  //     return await this.articleService.findAll();
  //   }

  //   @ApiOkResponse({ description: 'Get Article Success' })
  //   @ApiNotFoundResponse({ description: 'ID Article Not Found' })
  //   @Get(':id')
  //   async getArticleByIdOrFail(@Param('id') id: number) {
  //     return await this.articleService.getArticleByIdOrFail(id);
  //   }
  //   @ApiCreatedResponse({
  //     description: 'The record has been successfully created.',
  //   })
  //   @ApiUnauthorizedResponse({ description: 'You need to login ' })
  //   @Post()
  //   async createArticle(@Body() article: CreateArticleDTO) {
  //     return await this.articleService.createArticle(article);
  //   }

  //   @ApiOkResponse({ description: 'Get Article Success' })
  //   @ApiNotFoundResponse({ description: 'ID Article Not Found' })
  //   @Public()
  //   @Put(':id')
  //   async editArticle(@Body() article: EditArticleDTO, @Param('id') id: number) {
  //     return await this.articleService.editArticle(article, id);
  //   }

  //   @ApiOkResponse({ description: 'Get Article Success' })
  //   @ApiNotFoundResponse({ description: 'ID Article Not Found' })
  //   @Delete(':id')
  //   async removeArticle(@Param('id') id: number) {
  //     return await this.articleService.removeArticle(id);
  //   }
}
