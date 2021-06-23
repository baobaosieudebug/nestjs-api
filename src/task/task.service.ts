import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { TaskRepository } from './task.respository';
import { AddTaskDTO } from './dto/add-task.dto';
import { EditTaskDTO } from './dto/edit-task.dto';

@Injectable()
export class TaskService {
  constructor(private taskRepo: TaskRepository) {}

  async getOneById(id: number) {
    return await this.taskRepo.getById(id);
  }

  async getOneByIdOrFail(id: number) {
    const response = await this.getOneById(id);
    if (!response) {
      throw new NotFoundException();
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

  async checkTaskByCode(code: string) {
    const task = await this.getOneByCodeOrFail(code);
    if (!task) {
      return null;
    }
    return task;
  }

  async checkTaskByID(id: number) {
    const task = await this.getOneByIdOrFail(id);
    if (!task) {
      return null;
    }
    return task;
  }

  async create(dto: AddTaskDTO) {
    try {
      const task = this.taskRepo.create(dto);
      task.createdAt = new Date();
      return await this.taskRepo.save(task);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async addUserCreateTask(code: string, idUser: number) {
    const checkTask = await this.checkTaskByCode(code);
    if (!checkTask) {
      throw new NotFoundException();
    }
    const existUserCreateTask = await this.taskRepo.isTaskExistInUser(
      idUser,
      code,
    );
    if (existUserCreateTask == 0) {
      throw new BadRequestException('UserCreate Existed');
    }
    try {
      return await this.taskRepo.update(checkTask.id, { createUserId: idUser });
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async addTaskInProject(code: string, idProject: number) {
    const checkTask = await this.checkTaskByCode(code);
    if (!checkTask) {
      throw new NotFoundException();
    }
    const existTask = await this.taskRepo.isTaskExistInProject(idProject, code);
    if (existTask) {
      throw new BadRequestException('Task exist in Project');
    }
    try {
      return await this.taskRepo.update(checkTask.id, { projectID: idProject });
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async assignTask(code: string, idUser: number) {
    const checkTask = await this.checkTaskByCode(code);
    if (!checkTask) {
      throw new NotFoundException();
    }
    const existTask = await this.taskRepo.isAssignTask(idUser, code);
    if (existTask) {
      throw new NotFoundException('Task Assigned');
    }
    try {
      return await this.taskRepo.update(checkTask.id, { assignUserId: idUser });
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
  async edit(id: number, dto: EditTaskDTO) {
    const checkTask = this.checkTaskByID(id);
    if (!checkTask) {
      throw new NotFoundException();
    }
    const existCode = this.taskRepo.getByCode(dto.code);
    if (existCode) {
      throw new NotFoundException('Code must be unique');
    }
    try {
      return await this.taskRepo.update(id, dto);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async checkDeleted(id: number) {
    const task = this.taskRepo.getByIdWithDelete(id);
    if (!task) {
      return null;
    }
    return task;
  }

  async remove(id: number) {
    const checkTask = await this.checkTaskByID(id);
    if (!checkTask) {
      throw new NotFoundException();
    }
    const existDelete = await this.checkDeleted(id);

    if (existDelete) {
      throw new BadRequestException('Task Deleted');
    }
    try {
      return await this.taskRepo.update(id, { isDeleted: id });
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async removeTask(idProject: number, code: string) {
    const checkTask = await this.checkTaskByCode(code);
    if (!checkTask) {
      throw new NotFoundException();
    }
    const existTask = await this.taskRepo.isTaskExistInProject(idProject, code);
    if (!existTask) {
      throw new NotFoundException('Task not Exist Project');
    }
    try {
      return await this.taskRepo.update(checkTask.id, { projectID: null });
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async removeUserCreateTask(idUser: number, code: string) {
    const checkTask = await this.checkTaskByCode(code);
    if (!checkTask) {
      throw new NotFoundException();
    }
    const existTask = await this.taskRepo.isTaskExistInUser(idUser, code);
    if (!existTask) {
      throw new NotFoundException('Task not Exist User');
    }
    try {
      return await this.taskRepo.update(checkTask.id, { createUserId: null });
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async getAllTaskByIDProject(idProject: number) {
    try {
      return await this.taskRepo.getAllTaskByIDProject(idProject);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
