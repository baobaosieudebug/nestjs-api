import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from } from 'rxjs';
import { CreateArticleDto } from 'src/dto/create-article.dto';
import { EditAddressDTO } from 'src/dto/edit-address.dto';
import { UsersEntity } from 'src/users/users.entity';
import { Repository, UpdateResult } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { EditArticleDto } from '../dto/edit-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly ArticleRepository: Repository<ArticleEntity>,
  ) {}

  async createArticle(article: CreateArticleDto): Promise<CreateArticleDto> {
    return await this.ArticleRepository.create(article);
  }

  async editArticle(article: EditArticleDto): Promise<UpdateResult> {
    return await this.ArticleRepository.update(article.id, article);
  }
}
