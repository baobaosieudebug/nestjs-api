import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateArticleDTO } from './create-article.dto';

export class EditArticleDTO extends PartialType(CreateArticleDTO) {}
