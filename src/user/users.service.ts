import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AddUserDTO } from './dto/add-user.dto';
import { EditUserDTO } from './dto/edit-user.dto';
import { UserRepository } from './user.repository';
import { ProjectRepository } from '../project/project.repository';
import { GroupRepository } from '../group/group.repository';
import { TaskService } from '../task/task.service';
import { LoginUserDTO } from './dto/login-user.dto';
import { GetUserRO } from './ro/get-user.ro';
import { UsersEntity } from './users.entity';
import * as jwt from 'jsonwebtoken';
import { HandleUserRO } from './ro/edit-user.ro';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    private readonly userRepo: UserRepository,
    private readonly taskService: TaskService,
    private readonly projectRepo: ProjectRepository,
    private readonly groupRepo: GroupRepository,
  ) {}

  async getOneById(id: number) {
    return await this.userRepo.getOneById(id);
  }

  async getOneByEmail(email: string) {
    return await this.userRepo.getOneByEmail(email);
  }
  async getOneByEmailOrFail(email: string) {
    const user = await this.getOneByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getOneByIdOrFail(id: number) {
    const user = await this.getOneById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getAll() {
    return await this.userRepo.getAll();
  }

  async getUserResponse(user: UsersEntity): Promise<GetUserRO> {
    const response = new GetUserRO();
    response.name = user.name;
    response.email = user.email;
    return response;
  }

  async handleUserResponse(user: UsersEntity): Promise<HandleUserRO> {
    const response = new HandleUserRO();
    response.name = user.name;
    response.email = user.email;
    return response;
  }

  async create(user: AddUserDTO) {
    try {
      user.password = await bcrypt.hash(user.password, 12);
      const newUser = this.userRepo.create(user);
      return await this.userRepo.save(newUser);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async addUser(idUser: number, idGroup: number) {
    const checkUser = await this.userRepo.getOneAndGroupRelation(idUser);
    if (!checkUser) {
      throw new NotFoundException('User not found');
    }
    try {
      const group = await this.groupRepo.getOneById(idGroup);
      checkUser.groups.push(group);
      return await this.userRepo.save(checkUser);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async addUserInProject(idUser: number, projectId: number): Promise<HandleUserRO> {
    const checkUser = await this.getOneByIdOrFail(idUser);
    try {
      const project = await this.projectRepo.getOneAndUserRelation(projectId);
      await project.users.push(checkUser);
      await this.projectRepo.save(project);
      return this.handleUserResponse(checkUser);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async assignTask(idUser: number, codeTask: string) {
    await this.getOneByIdOrFail(idUser);
    try {
      return this.taskService.assignTask(codeTask, idUser);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, dto: EditUserDTO) {
    await this.getOneByIdOrFail(id);
    try {
      dto.password = await bcrypt.hash(dto.password, 12);
      return this.userRepo.update(id, dto);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number) {
    await this.getOneByIdOrFail(id);
    try {
      return await this.userRepo.update(id, { isDeleted: id });
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }
  async getAllUserByIdProject(projectId: number): Promise<GetUserRO[]> {
    try {
      const oldArray = await this.userRepo.getAllUserByIdProject(projectId);
      const newArray: GetUserRO[] = [];
      for (let i = 0; i < oldArray.length; i++) {
        const userRO = await this.getUserResponse(oldArray[i]);
        newArray.push(userRO);
      }
      return newArray;
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async getAllUserByIdGroup(idGroup: number) {
    try {
      return await this.userRepo.getAllUserByIdGroup(idGroup);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async login(data: LoginUserDTO) {
    // find username exist in db
    const user = await this.userRepo.findOne({ email: data.email });
    // if ((await bcrypt.compare(data.password, user.password)) == false) {
    //   throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    // }
    const token = this.getUserToken(user);
    return {
      id: user.id,
      email: user.email,
      roles: user.roles,
      token,
    };
  }

  private getUserToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const token = jwt.sign(payload, 'SECRET', { expiresIn: 3000 });
    return token;
  }
}
