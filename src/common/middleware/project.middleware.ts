import { Injectable, NestMiddleware, NotFoundException, UsePipes } from "@nestjs/common";
import { Request, Response, NextFunction } from 'express';
import { ProjectService } from '../../project/project.service';

@Injectable()
export class ProjectMiddleware implements NestMiddleware {
  constructor(private readonly projectService: ProjectService) {}
  use(req: Request, res: Response, next: NextFunction) {

  }
}
