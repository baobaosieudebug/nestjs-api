import { EntityRepository, Repository } from 'typeorm';
import { UserProjectEntity } from '../entities/user-project.entity';

@EntityRepository(UserProjectEntity)
export class UserProjectRepository extends Repository<UserProjectEntity> {
  async isUserExist(projectId: number, userId: number) {
    const checkExist = await this.count({
      where: { userId, projectId },
    });
    return checkExist > 0;
  }

  async getListUser(projectId: number) {
    return await this.find({ projectId });
  }
  async getListProject(userId: number) {
    return await this.find({ userId });
  }
}
