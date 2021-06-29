import { TaskEntity } from './task.entity';
import { EntityRepository, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

@EntityRepository(TaskEntity)
export class TaskRepository extends Repository<TaskEntity> {
  async getById(id) {
    return this.findOne({ id });
  }

  getAll() {
    return this.find({ isDeleted: 0 });
  }

  getByCode(code) {
    return this.findOne({ code });
  }

  async isTaskExistInProject(projectId: number, code: string) {
    return await this.count({
      where: { code, projectId: projectId },
    });
  }

  async isAssignTask(userID: number, code: string): Promise<boolean> {
    const response = await this.count({
      where: { code, assignUserId: null },
    });
    return response > 0;
  }

  getAllTaskByIDProject(projectId: number) {
    return this.find({ projectId: projectId });
  }

  async getAllUserByIDUserAssign(idUser: number) {
    return this.find({ assignUserId: idUser });
  }

  async getAllUserByIDUserCreate(idUser: number) {
    return this.find({ createUserId: idUser });
  }

  async isExistTaskCode(code: string, projectId: number): Promise<boolean> {
    const entity = await this.count({
      where: { code, projectId },
    });
    return entity > 0;
  }
}
