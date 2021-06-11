import { PartialType } from '@nestjs/swagger';
import { CreateArticleDTO } from './add-article.dto';

export class EditArticleDTO extends PartialType(CreateArticleDTO) {}
