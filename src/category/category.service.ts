import { Injectable } from '@nestjs/common';
import { ProjectService } from '../project/project.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Repository } from 'typeorm';
import { BaseService } from '../common/service/base.service';

@Injectable()
export class CategoryService extends BaseService<Category> {
  constructor(
    @InjectRepository(Category)
    private category: Repository<Category>,
    private projectService: ProjectService,
  ) {
    super(category, projectService);
  }
}
