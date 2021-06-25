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
    const idProject = Number(req.params.id);
    if (!idProject) {
      throw new InternalServerErrorException('error');
    }
    const check = await this.projectService.checkProjectByID(idProject);
    if (!check) {
      throw new NotFoundException();
    }
    next();
  }
}
