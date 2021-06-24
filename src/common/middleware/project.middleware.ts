import { Injectable, NestMiddleware, NotFoundException, UsePipes } from "@nestjs/common";
import { Request, Response, NextFunction } from 'express';
import { CheckProjectPipe } from '../pipe/check-project.pipe';
import { ProjectService } from '../../project/project.service';

@Injectable()
export class ProjectMiddleware implements NestMiddleware {
  use(projectService: ProjectService, next: NextFunction) {
    const check = projectService.getOneById(1);
    return check;
    // if (!check) {
    //   throw new NotFoundException();
    // }
  }
}
