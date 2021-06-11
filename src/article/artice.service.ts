import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateArticleDTO } from 'src/dto/add-article.dto';
import { Repository } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { EditArticleDTO } from '../dto/edit-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly ArticleRepository: Repository<ArticleEntity>,
  ) {}

  async findAll(): Promise<ArticleEntity[]> {
    return await this.ArticleRepository.find();
  }

  async getArticleById(id: number) {
    return await this.ArticleRepository.findOne(id);
  }
  async getArticleByIdOrFail(id: number) {
    if ((await this.getArticleById(id)) == null) {
      throw new NotFoundException('Article Not Found');
    } else {
      return this.getArticleById(id);
    }
  }

  async createArticle(article: CreateArticleDTO): Promise<CreateArticleDTO> {
    return await this.ArticleRepository.create(article);
  }

  async editArticle(article: EditArticleDTO, id: number) {
    const idArticle = await this.ArticleRepository.findOne(id);
    if (idArticle == undefined || article == undefined) {
      throw new NotFoundException(
        'Not Found Your Article,Check ID Or Body Request',
      );
    } else {
      await this.ArticleRepository.update(id, article);
      return HttpStatus.OK;
    }
  }

  async removeArticle(id: number) {
    if ((await this.getArticleById(id)) == null) {
      throw new NotFoundException(
        'Not Found Your Article,Check ID Or Body Request',
      );
    } else {
      await this.ArticleRepository.delete(id);
      return HttpStatus.OK;
    }
  }
}
