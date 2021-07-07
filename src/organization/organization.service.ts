import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OrganizationRepository } from './organization.repository';
import { ProjectService } from '../project/project.service';
import { UsersService } from '../user/users.service';
import { OrganizationEntity } from './organization.entity';
import { AddOrganizationDTO } from './dto/add-organization.dto';
import { EditOrganizationDTO } from './dto/edit-organization.dto';
import { HandleOrganizationRO } from './ro/handle-organization.ro';
import { HandleProjectRO } from '../project/ro/handle-project.ro';

@Injectable()
export class OrganizationService {
  private readonly logger = new Logger(ProjectService.name);
  constructor(
    private readonly repo: OrganizationRepository,
    @Inject(forwardRef(() => ProjectService))
    private readonly projectService: ProjectService,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  handleOrganizationResponse(organization: OrganizationEntity): HandleOrganizationRO {
    const response = new HandleOrganizationRO();
    response.name = organization.name;
    response.code = organization.code;
    response.domain = organization.domain;
    response.logo = organization.logo;
    response.description = organization.description;
    response.address = organization.address;
    response.city = organization.city;
    response.country = organization.country;
    response.plan = organization.plan;
    return response;
  }

  async getOneById(id: number): Promise<OrganizationEntity> {
    return await this.repo.getById(id);
  }

  async getOneByIdOrFail(id: number): Promise<OrganizationEntity> {
    const organization = await this.getOneById(id);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
    return organization;
  }

  getOneByCode(code: string): Promise<OrganizationEntity> {
    return this.repo.getByCode(code);
  }

  async getOneByCodeOrFail(code: string): Promise<OrganizationEntity> {
    const organization = await this.getOneByCode(code);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
    return organization;
  }

  async getAllProjectById(id: number): Promise<HandleProjectRO[]> {
    await this.getOneByIdOrFail(id);
    try {
      return await this.projectService.getAllProjectByIdOrg(id);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async checkOwner(req: any): Promise<OrganizationEntity> {
    const token = req.headers.authorization;
    const newToken = token.substring(7, token.length);
    const payload: any = this.jwtService.decode(newToken);
    if (!payload.organizationCode) {
      throw new NotFoundException('Not found organization');
    }
    const org = await this.repo.getOrgByOwnerId(payload.id);
    if (payload.organizationCode.code !== org.code) {
      throw new ForbiddenException('Forbidden');
    }
    return org;
  }

  async createCode(length: number) {
    let found = true;
    let code = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    while (found) {
      for (let i = 0; i < length; i++) {
        code += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      await this.checkOrgByCode(code);
      found = false;
    }
    return code;
  }

  async create(req: any, dto: AddOrganizationDTO): Promise<HandleOrganizationRO> {
    const token = req.headers.authorization;
    const newToken = token.substring(7, token.length);
    const payload: any = this.jwtService.decode(newToken);
    const randomCode = await this.createCode(10);
    const user = await this.userService.getOneByEmailOrFail(payload.email);
    if (user.organizations) {
      throw new BadRequestException('User created Organization');
    }
    try {
      const newOrg = this.repo.create(dto);
      newOrg.ownerId = payload.id;
      newOrg.code = randomCode;
      await this.repo.save(newOrg);
      return this.handleOrganizationResponse(newOrg);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async addProject(codeOrg: string, codeProject: string): Promise<HandleProjectRO> {
    const checkExist = await this.getOneByCodeOrFail(codeOrg);
    try {
      return this.projectService.addProject(checkExist.id, codeProject);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async checkOrgByCode(code: string) {
    const organization = await this.repo.isOrgExistCode(code);
    if (organization) {
      throw new NotFoundException('Organization Exist');
    }
  }

  async edit(req: any, dto: EditOrganizationDTO): Promise<HandleOrganizationRO> {
    const old = await this.checkOwner(req);
    try {
      const organization = await this.repo.merge(old, dto);
      await this.repo.update(old.id, organization);
      return this.handleOrganizationResponse(organization);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async delete(id: number): Promise<number> {
    const organization = await this.getOneByIdOrFail(id);
    try {
      organization.isDeleted = organization.id;
      await this.repo.update(id, organization);
      return id;
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async removeProject(code: string, codeProject: string): Promise<HandleProjectRO> {
    const checkExist = await this.getOneByCodeOrFail(code);
    try {
      return this.projectService.removeProject(checkExist.id, codeProject);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async uploadLogo(req, file): Promise<HandleOrganizationRO> {
    const organization = await this.checkOwner(req);
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      throw new BadRequestException('Only images file is allowed!');
    }
    organization.logo = file.originalname;
    return this.handleOrganizationResponse(organization);
  }
}
