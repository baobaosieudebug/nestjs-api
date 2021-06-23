import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';
import { CategoryService } from './category.service';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}
}
