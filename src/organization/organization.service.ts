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
import { OrganizationEntity } from './organization.entity';
import { ProjectService } from '../project/project.service';
import { UserService } from '../user/user.service';
import { OrganizationRepository } from './organization.repository';
import { AddOrganizationDTO } from './dto/add-organization.dto';
import { EditOrganizationDTO } from './dto/edit-organization.dto';
import { RandomString } from '../common/utils/random-string';
import { OrganizationRO } from './ro/organization.ro';
import { UserRO } from '../user/ro/user.ro';

@Injectable()
export class OrganizationService {
  private readonly logger = new Logger(ProjectService.name);
  constructor(
    private readonly repo: OrganizationRepository,
    @Inject(forwardRef(() => ProjectService))
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
  ) {}

  mappingOrganizationRO(organization: OrganizationEntity): OrganizationRO {
    const response = new OrganizationRO();
    response.name = organization.name;
    response.logo = organization.logo;
    response.description = organization.description;
    response.address = organization.address;
    response.city = organization.city;
    response.country = organization.country;
    response.plan = organization.plan;
    return response;
  }

  getOneByCode(code: string): Promise<OrganizationEntity> {
    return this.repo.getByCode(code);
  }

  async getOneOrFail(payload, code: string): Promise<OrganizationEntity> {
    await this.isOwner(payload);
    return await this.getOneByCode(code);
  }

  async getListUser(payload, domain: string): Promise<UserRO[]> {
    await this.isOwnerDomain(payload, domain);
    try {
      return await this.userService.getListUserByDomain(payload);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async isOwner(payload) {
    if (!payload.organizationCode) {
      throw new NotFoundException('Not found organization');
    }
    const org = await this.repo.isOwnerOrg(payload.organizationCode.code, payload.id);
    if (!org) {
      throw new ForbiddenException('Forbidden');
    }
  }
  async isOwnerDomain(payload, domain: string) {
    const isOwnerDomain = await this.repo.isOwnerDomain(domain, payload.id);
    if (!isOwnerDomain) {
      throw new ForbiddenException('Forbidden');
    }
  }

  async createCode(): Promise<string> {
    let code = '';
    let found = true;
    while (found) {
      code = RandomString(10);
      const existCode = await this.repo.isOrgCodeExist(code);
      if (!existCode) {
        found = false;
      }
    }
    return code;
  }

  async create(payload, dto: AddOrganizationDTO): Promise<OrganizationRO> {
    const randomCode = await this.createCode();
    const org = await this.repo.isExistOwner(payload.id);
    if (org) {
      throw new BadRequestException('User created Organization');
    }
    try {
      const newOrg = this.repo.create(dto);
      newOrg.ownerId = payload.id;
      newOrg.code = randomCode;
      await this.repo.save(newOrg);
      return this.mappingOrganizationRO(newOrg);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  invite(payload, domain: string) {
    if (!payload.organizationCode) {
      throw new BadRequestException('Organization not null');
    }
    if (payload.organizationCode.domain !== domain) {
      throw new ForbiddenException('Forbidden');
    }
    try {
      return this.userService.invite(payload);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async edit(payload, dto: EditOrganizationDTO): Promise<OrganizationRO> {
    await this.isOwner(payload);
    const old = await this.getOneByCode(payload.organizationCode.code);
    try {
      const organization = await this.repo.merge(old, dto);
      await this.repo.update(old.id, organization);
      return this.mappingOrganizationRO(organization);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  // async delete(id: number): Promise<number> {
  //   const organization = await this.getOneByIdOrFail(id);
  //   try {
  //     organization.isDeleted = organization.id;
  //     await this.repo.update(id, organization);
  //     return id;
  //   } catch (e) {
  //     this.logger.error(e);
  //     throw new InternalServerErrorException();
  //   }
  // }

  // async uploadLogo(req, file): Promise<OrganizationRO> {
  //   const organization = await this.isOwner(req);
  //   if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
  //     throw new BadRequestException('Only images file is allowed!');
  //   }
  //   organization.logo = file.originalname;
  //   return this.mappingOrganizationRO(organization);
  // }
}
