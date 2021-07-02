import { Delete, Get, Param, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AddOrganizationDTO } from './dto/add-organization.dto';
import { EditOrganizationDTO } from './dto/edit-organization.dto';
import { OrganizationService } from './organization.service';
import { GetOrganizationRO } from './ro/get-organization.ro';
import { GetProjectRO } from '../project/ro/get-project.ro';
import { HandleOrganizationRO } from './ro/handle-organization.ro';

@ApiTags('Organization')
@ApiNotFoundResponse({ description: 'Not Found' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
@Controller('organization')
export class OrganizationController {
  constructor(private organizationService: OrganizationService) {}

  @ApiOkResponse({ description: 'Success' })
  @Get()
  async getAll(): Promise<GetOrganizationRO[]> {
    return await this.organizationService.getAll();
  }

  @ApiOkResponse({ description: 'Success' })
  @Get(':id')
  async getOneById(@Param('id') id: number): Promise<GetOrganizationRO> {
    const organization = await this.organizationService.getOneByIdOrFail(id);
    return await this.organizationService.getOrganizationResponse(organization);
  }

  @ApiOkResponse({ description: 'Success' })
  @Get('code/:code')
  async getOneTaskByCode(@Param('code') code: string): Promise<GetOrganizationRO> {
    const organization = await this.organizationService.getOneByCodeOrFail(code);
    return await this.organizationService.getOrganizationResponse(organization);
  }

  @ApiOkResponse({ description: 'Success' })
  @Get(':id/projects')
  async getAllProjectById(@Param('id') id: number): Promise<GetProjectRO[]> {
    return await this.organizationService.getAllProjectById(id);
  }

  @ApiCreatedResponse({ description: 'Created' })
  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() dto: AddOrganizationDTO): Promise<HandleOrganizationRO> {
    return await this.organizationService.create(dto);
  }

  @ApiOkResponse({ description: 'Success' })
  @Post(':code/addProject/:codeProject')
  async addProject(@Param('code') codeOrg: string, @Param('codeProject') codeProject: string): Promise<GetProjectRO> {
    return await this.organizationService.addProject(codeOrg, codeProject);
  }

  @ApiOkResponse({ description: 'Success' })
  @Put(':id')
  @UsePipes(ValidationPipe)
  async edit(@Body() dto: EditOrganizationDTO, @Param('id') id: number): Promise<HandleOrganizationRO> {
    return await this.organizationService.edit(id, dto);
  }

  @ApiOkResponse({ description: 'Success' })
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<GetOrganizationRO> {
    return await this.organizationService.delete(id);
  }

  @Delete(':code/removeProject/:codeProject')
  async removeProjectInOrg(
    @Param('codeProject') codeProject: string,
    @Param('code') code: string,
  ): Promise<GetProjectRO> {
    return await this.organizationService.removeProject(code, codeProject);
  }
}
