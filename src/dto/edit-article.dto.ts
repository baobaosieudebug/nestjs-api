import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateArticleDto } from './create-article.dto';

export class EditArticleDto extends PartialType(
  OmitType(CreateArticleDto, ['name'] as const),
) {}
