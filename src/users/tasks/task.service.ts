import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from './task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly ArticleRepository: Repository<TaskEntity>,
  ) {}

  //   async findAll(): Promise<ArticleEntity[]> {
  //     return await this.ArticleRepository.find();
  //   }

  //   async getArticleById(id: number) {
  //     return await this.ArticleRepository.findOne(id);
  //   }
  //   async getArticleByIdOrFail(id: number) {
  //     if ((await this.getArticleById(id)) == null) {
  //       throw new NotFoundException('Article Not Found');
  //     } else {
  //       return this.getArticleById(id);
  //     }
  //   }

  //   async createArticle(article: CreateArticleDTO): Promise<CreateArticleDTO> {
  //     return await this.ArticleRepository.create(article);
  //   }

  //   async editArticle(article: EditArticleDTO, id: number) {
  //     const idArticle = await this.ArticleRepository.findOne(id);
  //     if (idArticle == undefined || article == undefined) {
  //       throw new NotFoundException(
  //         'Not Found Your Article,Check ID Or Body Request',
  //       );
  //     } else {
  //       await this.ArticleRepository.update(id, article);
  //       return HttpStatus.OK;
  //     }
  //   }

  //   async removeArticle(id: number) {
  //     if ((await this.getArticleById(id)) == null) {
  //       throw new NotFoundException(
  //         'Not Found Your Article,Check ID Or Body Request',
  //       );
  //     } else {
  //       await this.ArticleRepository.delete(id);
  //       return HttpStatus.OK;
  //     }
  //   }
}
