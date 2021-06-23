import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';
import { TypeService } from './type.service';

@ApiTags('Type')
@Controller('type')
export class TypeController {
  constructor(private typeService: TypeService) {}
}
