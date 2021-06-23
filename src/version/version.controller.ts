import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';
import { VersionService } from './version.service';

@ApiTags('Version')
@Controller('version')
export class VersionController {
  constructor(private versionService: VersionService) {}
}
