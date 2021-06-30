import {
  Injectable,
  InternalServerErrorException,
  NestMiddleware,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ProjectService } from '../../project/project.service';

@Injectable()
export class ProjectMiddleware implements NestMiddleware {
  constructor(private readonly projectService: ProjectService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const projectId = Number(req.params.id);
    if (!projectId) {
      // throw new InternalServerErrorException('error');
    }
    const check = await this.projectService.getOneByIdOrFail(projectId);
    if (!check) {
      throw new NotFoundException();
    }
    next();
  }
}
