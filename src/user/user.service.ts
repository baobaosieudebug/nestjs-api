import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';
import { UserOrganizationEntity } from './entities/user-organization.entity';
import { UserProjectEntity } from './entities/user-project.entity';
import { UserEntity } from './entities/user.entity';
import { MailService } from '../mail/mail.service';
import { UserOrganizationRepository } from './repository/user-organization.repository';
import { UserProjectRepository } from './repository/user-project.repository';
import { UserRepository } from './repository/user.repository';
import { SelfUserRO } from './ro/self-user.ro';
import { UserRO } from './ro/user.ro';
import { EditUserDTO } from './dto/edit-user.dto';
import * as bcrypt from 'bcrypt';
import { UserRoleRepository } from './repository/user-role.repository';
import { UserRoleEntity } from './entities/user-role.entity';

@Injectable()
export class UserService {
  private algorithm = 'aes-256-cbc';
  private pepper = 'superSecretPepper';
  private readonly logger = new Logger(UserService.name);
  constructor(
    private readonly repo: UserRepository,
    private readonly mailService: MailService,
    private readonly userOrgRepo: UserOrganizationRepository,
    private readonly userProjectRepo: UserProjectRepository,
    private readonly userRoleRepo: UserRoleRepository,
  ) {}

  async isOwner(payload, username: string): Promise<boolean> {
    return payload.username === username;
  }

  async mappingSelfUserRO(user: UserEntity): Promise<SelfUserRO> {
    const response = new SelfUserRO();
    response.username = user.username;
    response.email = user.email;
    response.status = user.status;
    response.avatar = user.avatar;
    response.phone = user.phone;
    return response;
  }

  mappingUserRO(user: UserEntity): UserRO {
    const response = new UserRO();
    response.username = user.username;
    response.avatar = user.avatar;
    response.status = user.status;
    return response;
  }

  async mappingUserOrgToRO(oldArray: UserOrganizationEntity[]): Promise<UserRO[]> {
    const newArray: UserRO[] = [];
    for (let i = 0; i < oldArray.length; i++) {
      const user = await this.getOneById(oldArray[i].userId);
      const userRO = await this.mappingUserRO(user);
      newArray.push(userRO);
    }
    return newArray;
  }

  async mappingUserProjectToRO(oldArray: UserProjectEntity[]): Promise<UserRO[]> {
    const newArray: UserRO[] = [];
    for (let i = 0; i < oldArray.length; i++) {
      const user = await this.getOneById(oldArray[i].userId);
      const userRO = await this.mappingUserRO(user);
      newArray.push(userRO);
    }
    return newArray;
  }

  async mappingUserRoleToRO(oldArray: UserRoleEntity[]): Promise<UserRO[]> {
    const newArray: UserRO[] = [];
    for (let i = 0; i < oldArray.length; i++) {
      const user = await this.getOneById(oldArray[i].userId);
      const userRO = await this.mappingUserRO(user);
      newArray.push(userRO);
    }
    return newArray;
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

  async getOneById(id: number) {
    return await this.repo.getOneById(id);
  }

  async getOneByIdOrFail(id: number) {
    const user = await this.getOneById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getListUser(projectId: number): Promise<UserRO[]> {
    try {
      const userProjectArray = await this.userProjectRepo.getListUser(projectId);
      return this.mappingUserProjectToRO(userProjectArray);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async getListAdmin(roleId: number): Promise<UserRO[]> {
    try {
      const adminArray = await this.userRoleRepo.getListAdmin(roleId);
      return this.mappingUserRoleToRO(adminArray);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async getListUserByDomain(payload): Promise<UserRO[]> {
    try {
      const userOrgArray = await this.userOrgRepo.getListUser(payload.organizationCode.id);
      return this.mappingUserOrgToRO(userOrgArray);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async isSameProject(id: number, userProjectArray: UserProjectEntity[]) {
    let check = false;
    for (let i = 0; i < userProjectArray.length; i++) {
      const projectId = userProjectArray[i].projectId;
      console.log(projectId);
      const isProjectByIdReq = await this.userProjectRepo.isUserExist(projectId, id);
      if (isProjectByIdReq) {
        check = true;
      }
    }
    if (!check) {
      throw new ForbiddenException('Forbidden');
    }
  }

  async getOneWithOwner(payload, username: string) {
    const isOwner = await this.isOwner(payload, username);
    const user = await this.getOneByUsername(username);
    if (isOwner) {
      return this.mappingSelfUserRO(user);
    }
    const userProjectArray = await this.userProjectRepo.getListProject(user.id);
    await this.isSameProject(payload.id, userProjectArray);
    return this.mappingUserRO(user);
  }

  encryptCipheriv(data) {
    const iv = randomBytes(16);
    const key = createHash('sha256').update(this.pepper).digest('base64');
    const cipher = createCipheriv(this.algorithm, key.substring(0, 32), iv);
    let token = cipher.update(JSON.stringify(data));
    token = Buffer.concat([token, cipher.final()]);
    return `${iv.toString('hex')}$:${token.toString('hex')}`;
  }

  decryptCipheriv(hash) {
    const parts = hash.split(':');
    const iv = Buffer.from(parts.shift(), 'hex');
    const tokenBody = Buffer.from(parts.join(':'), 'hex');
    const key = createHash('sha256').update(this.pepper).digest('base64');
    const decipher = createDecipheriv(this.algorithm, key.substring(0, 32), iv);
    let decrypted = decipher.update(tokenBody);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return JSON.parse(decrypted.toString());
  }

  async invite(payload) {
    const emailReceive = process.env.MAIl_USER;
    payload.emailReceive = emailReceive;
    const userReceive = await this.getOneByEmailOrFail(emailReceive);
    const isExitUser = await this.userOrgRepo.isExistUser(userReceive.id, payload.organizationCode.id);
    if (isExitUser) {
      throw new BadRequestException('User exist Organization');
    }
    const token = this.encryptCipheriv(payload);
    const data = {
      to: emailReceive,
      from: payload.email, // sender address
      subject: 'Invite Organization! Confirm your Email',
      template: './layout/invite-org.hbs',
      context: {
        name: payload.username,
        emailReceive: emailReceive,
        url: process.env.LOCAL_HOST,
        token: token,
      },
    };

    try {
      const sendMailInfo = await this.mailService.sendMail(data);
      return sendMailInfo.accepted.join();
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async addUser(projectId: number, id: number): Promise<UserRO> {
    const user = await this.getOneByIdOrFail(id);
    try {
      const userProject = this.userProjectRepo.create();
      userProject.projectId = projectId;
      userProject.userId = id;
      await this.userProjectRepo.save(userProject);
      return this.mappingUserRO(user);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async joinOrg(token) {
    try {
      const decryptToken = await this.decryptCipheriv(token);
      const user = await this.repo.getOneByEmail(decryptToken.userReceive);
      const userOrg = await this.userOrgRepo.create();
      userOrg.organizationId = decryptToken.organizationCode.id;
      userOrg.userId = user.id;
      userOrg.active = true;
      await this.userOrgRepo.save(userOrg);
      return userOrg;
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async edit(payload, id: number, dto: EditUserDTO): Promise<UserRO> {
    const old = await this.getOneByIdOrFail(id);
    if (payload.id !== id) {
      throw new ForbiddenException('Forbidden');
    }
    try {
      dto.password = await bcrypt.hash(dto.password, 12);
      const user = await this.repo.merge(old, dto);
      await this.repo.update(id, user);
      return this.mappingUserRO(user);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async getRoleById(id: number) {
    try {
      return this.userRoleRepo.getRoleById(id);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }
}
