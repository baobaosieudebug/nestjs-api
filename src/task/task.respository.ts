import { TaskEntity } from './task.entity';
import { EntityRepository, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

@EntityRepository(TaskEntity)
export class TaskRepository extends Repository<TaskEntity> {
  async getById(id) {
    return this.findOne({ id });
  }

  getAll() {
    return this.find({ isDeleted: null });
  }

  getByCode(code) {
    return this.findOne({ code });
  }

  async getOneByIdOrFail(id: number) {
    const response = await this.getById(id);
    if (!response) {
      throw new NotFoundException();
    }
    return response;
  }

  async getOneByCodeOrFail(code: string) {
    const response = await this.getByCode(code);
    if (!response) {
      throw new NotFoundException();
    }
    return response;
  }

  async getByIdWithDelete(id) {
    const entity = await this.count({ where: { id, isDeleted: id } });
    return entity > 0;
  }

  async isTaskExistInProject(projectId: number, code: string) {
    return await this.count({
      where: { code, projectId: projectId },
    });
  }

  async isTaskExistInUser(userID: number, code: string) {
    return await this.count({
      where: { code, createUserId: null },
    });
  }

  async isAssignTask(userID: number, code: string) {
    return await this.count({
      where: { code, userAssign: null },
    });
  }

  getAllTaskByIDProject(idProject: number) {
    return this.find({ projectId: idProject });
  }

  async getAllUserByIDUserAssign(idUser: number) {
    return this.find({ assignUserId: idUser });
  }

  async getAllUserByIDUserCreate(idUser: number) {
    return this.find({ createUserId: idUser });
  }

  async isExistTaskByAssignUser(idUser: number) {
    const entity = await this.count({
      where: { assignUserId: idUser },
    });
    return entity > 0;
  }

  async isExistTaskByCreateUser(idUser: number) {
    const entity = await this.count({
      where: { createUserId: idUser },
    });
    return entity > 0;
  }

  async isExistTaskByIDProject(idProject: number) {
    const entity = await this.count({
      where: { projectId: idProject },
    });
    return entity > 0;
  }
}
