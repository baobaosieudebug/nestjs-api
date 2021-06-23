import { Injectable } from '@nestjs/common';
import { VersionRepository } from './version.repository';

@Injectable()
export class VersionService {
  constructor(private readonly versionRepo: VersionRepository) {}
}
