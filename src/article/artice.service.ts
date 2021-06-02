import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from } from 'rxjs';
import { CreateArticleDTO } from 'src/dto/create-article.dto';
import { UsersEntity } from 'src/users/users.entity';
import { Repository, UpdateResult } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { EditArticleDTO } from '../dto/edit-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly ArticleRepository: Repository<ArticleEntity>,
  ) {}

  async createArticle(article: CreateArticleDTO): Promise<CreateArticleDTO> {
    return await this.ArticleRepository.create(article);
  }

  async editArticle(article: EditArticleDTO): Promise<UpdateResult> {
    return await this.ArticleRepository.update(article.id, article);
  }

  async findAll(): Promise<ArticleEntity[]> {
    return await this.ArticleRepository.find();
  }
}
