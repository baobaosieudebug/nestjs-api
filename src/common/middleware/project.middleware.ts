import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ProjectService } from '../../project/project.service';

@Injectable()
export class ProjectMiddleware implements NestMiddleware {
  constructor(private readonly projectService: ProjectService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const projectId = Number(req.params.projectId);
    if (!projectId) {
      throw new BadRequestException('Id Project Incorrect');
    }
    await this.projectService.checkProjectExist(projectId);
    next();
  }
}
