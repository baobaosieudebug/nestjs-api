import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { TaskRepository } from './task.respository';
import { AddTaskDTO } from './dto/add-task.dto';
import { EditTaskDTO } from './dto/edit-task.dto';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepo: TaskRepository) {}

  async getOneById(id: number) {
    return await this.taskRepo.getById(id);
  }

  async getOneByIdOrFail(id: number) {
    const response = await this.getOneById(id);
    if (!response) {
      throw new NotFoundException('Task Not Found');
    }
    return response;
  }

  async getOneByCode(code: string) {
    return await this.taskRepo.getByCode(code);
  }

  async getOneByCodeOrFail(code: string) {
    const response = await this.getOneByCode(code);
    if (!response) {
      throw new NotFoundException();
    }
    return response;
  }

  async getAll() {
    return await this.taskRepo.getAll();
  }

  async checkExistCode(code: string, projectId: number) {
    const checkExist = await this.taskRepo.isExistTaskCode(code, projectId);
    if (checkExist) {
      throw new NotFoundException('Task Exist');
    }
    return checkExist;
  }

  async create(dto: AddTaskDTO) {
    try {
      const task = this.taskRepo.create(dto);
      task.createdAt = new Date();
      // task.createUserId = idUser;
      return await this.taskRepo.save(task);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async addTaskInProject(code: string, idProject: number) {
    const task = await this.getOneByCodeOrFail(code);
    const checkTask = await this.checkExistCode(code, idProject);
    if (!checkTask) {
      try {
        return await this.taskRepo.update(task.id, { projectId: idProject });
      } catch (e) {
        throw new InternalServerErrorException();
      }
    }
  }

  async assignTask(code: string, idUser: number) {
    const task = await this.getOneByCodeOrFail(code);
    const checkTask = await this.taskRepo.isAssignTask(idUser, code);
    if (checkTask) {
      try {
        return await this.taskRepo.update(task.id, { assignUserId: idUser });
      } catch (e) {
        throw new InternalServerErrorException();
      }
    }
  }
  async edit(id: number, dto: EditTaskDTO) {
    const checkTask = await this.getOneByIdOrFail(id);
    if (checkTask) {
      try {
        return await this.taskRepo.update(id, dto);
      } catch (e) {
        throw new InternalServerErrorException();
      }
    }
  }

  async remove(id: number) {
    const checkTask = await this.getOneByIdOrFail(id);
    if (checkTask) {
      try {
        return await this.taskRepo.update(id, { isDeleted: id });
      } catch (e) {
        throw new InternalServerErrorException();
      }
    }
  }

  async removeTask(idProject: number, code: string) {
    const checkTask = await this.getOneByCodeOrFail(code);
    const existTask = await this.taskRepo.isExistTaskCode(code, idProject);
    if (existTask) {
      try {
        return await this.taskRepo.update(checkTask.id, { projectId: null });
      } catch (e) {
        throw new InternalServerErrorException();
      }
    }
  }

  async getAllTaskByIDProject(idProject: number) {
    try {
      return await this.taskRepo.getAllTaskByIDProject(idProject);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  // async getAllAssignTaskByIDUser(idUser: number) {
  //   try {
  //     return await this.taskRepo.getAllUserByIDUserAssign(idUser);
  //   } catch (e) {
  //     throw new InternalServerErrorException();
  //   }
  // }
  //
  // async getAllCreateTaskByIDUser(idUser: number) {
  //   try {
  //     return await this.taskRepo.getAllUserByIDUserCreate(idUser);
  //   } catch (e) {
  //     throw new InternalServerErrorException();
  //   }
  // }
}
