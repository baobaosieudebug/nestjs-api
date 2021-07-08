import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UsersEntity } from './users.entity';
import { SelfUserRO } from './ro/self-user.ro';

@Injectable()
export class UsersService {
  // private readonly logger = new Logger(UsersService.name);
  constructor(private readonly repo: UserRepository) {}

  // async isOwner(payload) {
  //   if (!payload.organizationCode) {
  //     throw new NotFoundException('Not found organization');
  //   }
  //   const org = await this.repo.isOwnerOrg(payload.organizationCode.code, payload.id);
  //   if (!org) {
  //     throw new ForbiddenException('Forbidden');
  //   }
  // }

  async mappingSelfUserRO(user: UsersEntity): Promise<SelfUserRO> {
    const response = new SelfUserRO();
    response.username = user.username;
    response.email = user.email;
    response.status = user.status;
    response.avatar = user.avatar;
    response.phone = user.phone;
    return response;
  }

  async getOneByUsername(username: string) {
    return await this.repo.getOneByUsername(username);
  }

  async getOneByEmail(email: string) {
    return await this.repo.getOneByEmail(email);
  }
  async getOneByEmailOrFail(email: string) {
    const user = await this.getOneByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // async getOneOrFail(payload) {
  //   return await this.getOneByUsername(payload.username);
  // }

  // async getAll(): Promise<GetUserRO[]> {
  //   const oldArray = await this.repo.getAll();
  //   const newArray: GetUserRO[] = [];
  //   for (let i = 0; i < oldArray.length; i++) {
  //     const userRO = await this.getUserResponse(oldArray[i]);
  //     newArray.push(userRO);
  //   }
  //   return newArray;
  // }

  // async getUserResponse(user: UsersEntity): Promise<GetUserRO> {
  //   const response = new GetUserRO();
  //   response.name = user.username;
  //   response.email = user.email;
  //   return response;
  // }
  //

  // async create(user: AddUserDTO): Promise<UserRO> {
  //   try {
  //     user.password = await bcrypt.hash(user.password, 12);
  //     const newUser = this.repo.create(user);
  //     await this.repo.save(newUser);
  //     return this.handleUserResponse(newUser);
  //   } catch (e) {
  //     this.logger.error(e);
  //     throw new InternalServerErrorException();
  //   }
  // }
  //
  // async addUser(idUser: number, idGroup: number): Promise<UserRO> {
  //   const checkUser = await this.repo.getOneAndGroupRelation(idUser);
  //   if (!checkUser) {
  //     throw new NotFoundException('User not found');
  //   }
  //   try {
  //     const group = await this.groupRepo.getOneById(idGroup);
  //     checkUser.groups.push(group);
  //     await this.repo.save(checkUser);
  //     return this.handleUserResponse(checkUser);
  //   } catch (e) {
  //     this.logger.error(e);
  //     throw new InternalServerErrorException();
  //   }
  // }

  // async addUserInProject(idUser: number, projectId: number): Promise<HandleUserRO> {
  //   const checkUser = await this.getOneByIdOrFail(idUser);
  //   try {
  //     const project = await this.projectRepo.getOneAndUserRelation(projectId);
  //     await project.users.push(checkUser);
  //     await this.projectRepo.save(project);
  //     return this.handleUserResponse(checkUser);
  //   } catch (e) {
  //     this.logger.error(e);
  //     throw new InternalServerErrorException();
  //   }
  // }

  // async addUserOrganization(code: string, idUser: number) {
  //   const userExist = await this.getOneByIdOrFail(idUser);
  //   try {
  //     const organization = await this.orgRepo.getOneAndUserRelation(code);
  //     await organization.users.push(userExist);
  //     await this.orgRepo.save(organization);
  //     return this.handleUserResponse(userExist);
  //   } catch (e) {
  //     this.logger.error(e);
  //     throw new InternalServerErrorException();
  //   }
  // }

  // async assignTask(idUser: number, codeTask: string): Promise<HandleTaskRO> {
  //   await this.getOneByIdOrFail(idUser);
  //   try {
  //     return this.taskService.assignTask(codeTask, idUser);
  //   } catch (e) {
  //     this.logger.error(e);
  //     throw new InternalServerErrorException();
  //   }
  // }
  //
  // async edit(id: number, dto: EditUserDTO): Promise<UserRO> {
  //   const old = await this.getOneByIdOrFail(id);
  //   try {
  //     dto.password = await bcrypt.hash(dto.password, 12);
  //     const user = await this.repo.merge(old, dto);
  //     await this.repo.update(id, user);
  //     return this.handleUserResponse(user);
  //   } catch (e) {
  //     this.logger.error(e);
  //     throw new InternalServerErrorException();
  //   }
  // }
  //
  // async delete(id: number): Promise<UserRO> {
  //   const user = await this.getOneByIdOrFail(id);
  //   try {
  //     user.isDeleted = user.id;
  //     await this.repo.update(id, user);
  //     return this.handleUserResponse(user);
  //   } catch (e) {
  //     this.logger.error(e);
  //     throw new InternalServerErrorException();
  //   }
  // }
  // async getAllUserByIdProject(projectId: number): Promise<GetUserRO[]> {
  //   try {
  //     const oldArray = await this.repo.getAllUserByIdProject(projectId);
  //     const newArray: GetUserRO[] = [];
  //     for (let i = 0; i < oldArray.length; i++) {
  //       const userRO = await this.getUserResponse(oldArray[i]);
  //       newArray.push(userRO);
  //     }
  //     return newArray;
  //   } catch (e) {
  //     this.logger.error(e);
  //     throw new InternalServerErrorException();
  //   }
  // }

  // async getAllUserByIdGroup(idGroup: number): Promise<GetUserRO[]> {
  //   try {
  //     const oldArray = await this.repo.getAllUserByIdGroup(idGroup);
  //     const newArray: GetUserRO[] = [];
  //     for (let i = 0; i < oldArray.length; i++) {
  //       const userRO = await this.getUserResponse(oldArray[i]);
  //       newArray.push(userRO);
  //     }
  //     return newArray;
  //   } catch (e) {
  //     this.logger.error(e);
  //     throw new InternalServerErrorException();
  //   }
  // }
}
