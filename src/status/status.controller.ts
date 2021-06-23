import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';
import { StatusService } from './status.service';

@ApiTags('Status')
@Controller('status')
export class StatusController {
  constructor(private statusService: StatusService) {}
}
