import {
  BadRequestException,
  forwardRef,
  HttpService,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { RegisterUserDTO } from '../user/dto/register-user.dto';
import { LoginUserDTO } from '../user/dto/login-user.dto';
import { UserService } from '../user/user.service';
import { UserRepository } from '../user/repository/user.repository';
import { RandomString } from '../common/utils/random-string';
import { UserEntity } from '../user/entities/user.entity';
import { UserRO } from '../user/ro/user.ro';
import { OrganizationService } from '../organization/organization.service';
import { PermissionRepository } from './repository/permission.repository';
import { ActionRepository } from './repository/action.repository';
import { ResourceRepository } from './repository/resource.repository';
import { awsConfig } from '../config/aws.config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly userService: UserService,
    private readonly userRepo: UserRepository,
    @Inject(forwardRef(() => OrganizationService))
    private readonly orgService: OrganizationService,
    private readonly permissionRepo: PermissionRepository,
    private readonly actionRepo: ActionRepository,
    private readonly resourceRepo: ResourceRepository,
  ) {}

  async isExistUser(email: string, username: string) {
    const isExistEmail = await this.userRepo.isExistEmail(email);
    const isExistUsername = await this.userRepo.isExistUsername(username);
    if (isExistEmail) {
      throw new BadRequestException('email must be unique');
    }
    if (isExistUsername) {
      throw new BadRequestException('username must be unique');
    }
  }

  async createCode(): Promise<string> {
    let code = '';
    let found = true;
    while (found) {
      code = RandomString(10);
      const existCode = await this.userRepo.isExistCode(code);
      if (!existCode) {
        found = false;
      }
    }
    return code;
  }

  mappingUserRO(user: UserEntity): UserRO {
    const response = new UserRO();
    response.username = user.username;
    response.avatar = user.avatar;
    response.status = user.status;
    return response;
  }

  async register(user: RegisterUserDTO): Promise<UserRO> {
    await this.isExistUser(user.email, user.username);
    try {
      user.password = await bcrypt.hash(user.password, 12);
      const newUser = this.userRepo.create(user);
      newUser.code = await this.createCode();
      await this.userRepo.save(newUser);
      return this.mappingUserRO(newUser);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async login(data: LoginUserDTO) {
    const user = await this.userService.getOneByEmailOrFail(data.email);
    if (!(await bcrypt.compare(data.password, user.password))) {
      throw new NotFoundException('User wrong password');
    }
    const token = await this.getUserToken(user);
    return {
      id: user.id,
      username: user.username,
      organizationCode: user.organization,
      email: user.email,
      token,
    };
  }

  async getUserToken(user) {
    const role = await this.userService.getRoleById(user.id);
    const payload = {
      id: user.id,
      username: user.username,
      organizationCode: user.organization,
      email: user.email,
      role: role.roleId,
    };
    const token = jwt.sign(payload, 'SECRET', { expiresIn: 60000 });
    return token;
  }

  async addPermission(payload, data) {
    const lengthPer = data.permission.length;
    for (let i = 0; i < lengthPer; i++) {
      const lengthAction = data.permission[i].actions.length;
      for (let j = 0; j < lengthAction; j++) {
        const code = data.permission[i].actions[j].code;
        const codeResource = data.permission[i].code;
        const resourceId = await this.resourceRepo.getIdByCode(codeResource);
        const actionId = await this.actionRepo.getIdByCode(code, resourceId);
        const isExistPer = await this.permissionRepo.isExistPer(resourceId, data.role_id, actionId);
        if (isExistPer) break;
        const permission = this.permissionRepo.create();
        permission.roleId = data.role_id;
        permission.resourceId = resourceId;
        permission.actionId = actionId;
        permission.allowed = 1;
        permission.createdBy = payload.id;
        await this.permissionRepo.save(permission);
      }
    }
    return data;
  }

  async addRole(payload, data) {
    await this.orgService.isOwner(payload);
    try {
      return await this.addPermission(payload, data);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async isExistPermission(actionId: number, resourceId: number, roleId: number) {
    try {
      return await this.permissionRepo.isExistPer(actionId, resourceId, roleId);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }
}
