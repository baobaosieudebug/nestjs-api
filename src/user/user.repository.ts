import { UsersEntity } from './users.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(UsersEntity)
export class UserRepository extends Repository<UsersEntity> {
  getOneByUsername(username: string) {
    return this.findOne({ username, isDeleted: 0 });
  }

  async getOneByEmail(email: string) {
    return this.findOne({ email, isDeleted: 0 }, { relations: ['organization'] });
  }

  getAll() {
    return this.find({ isDeleted: 0 });
  }

  // getOneAndGroupRelation(id) {
  //   return this.findOne({ id, isDeleted: 0 }, { relations: ['groups'] });
  // }

  // getOneAndOrgRelation(id: number) {
  //   return this.findOne({ id, isDeleted: 0 }, { relations: ['organizations'] });
  // }
  //
  // async getAllUserByIdProject(projectId: number) {
  //   return await this.createQueryBuilder('user')
  //     .leftJoinAndSelect('user.projects', 'project')
  //     .where('project.id = :projectId', { projectId })
  //     .getMany();
  // }

  // async getAllUserByIdGroup(idGroup: number) {
  //   return await this.createQueryBuilder('user')
  //     .leftJoinAndSelect('user.groups', 'group')
  //     .where('group.id = :idGroup', { idGroup })
  //     .getMany();
  // }

  async isExistEmail(email: string): Promise<boolean> {
    const checkExist = await this.count({
      where: { email, isDeleted: 0 },
    });
    return checkExist > 0;
  }

  async isExistUsername(username: string): Promise<boolean> {
    const checkExist = await this.count({
      where: { username, isDeleted: 0 },
    });
    return checkExist > 0;
  }

  async isExistCode(code: string): Promise<boolean> {
    const checkExist = await this.count({
      where: { code, isDeleted: 0 },
    });
    return checkExist > 0;
  }
}
