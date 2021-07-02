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

@ApiTags('Organization')
@ApiNotFoundResponse({ description: 'Not Found' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
@Controller('organization')
export class OrganizationController {
  constructor(private organizationService: OrganizationService) {}

  @ApiOkResponse({ description: 'Success' })
  @Get()
  async getAllOrganization() {
    return await this.organizationService.getAllOrganization();
  }

  @ApiOkResponse({ description: 'Success' })
  @Get(':id')
  async getOrganizationByIdOrFail(@Param('id') id: number) {
    return await this.organizationService.getOneByIdOrFail(id);
  }

  @ApiOkResponse({ description: 'Success' })
  @Get('code/:code')
  async getOneTaskByCode(@Param('code') code: string) {
    return await this.organizationService.getOneByCodeOrFail(code);
  }

  @ApiOkResponse({ description: 'Success' })
  @Get(':id/projects')
  async getAllProjectById(@Param('id') id: number) {
    return await this.organizationService.getAllProjectById(id);
  }

  @ApiCreatedResponse({ description: 'Created' })
  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() dto: AddOrganizationDTO) {
    return await this.organizationService.createOrganization(dto);
  }

  @ApiOkResponse({ description: 'Success' })
  @Post(':code/addProject/:codeProject')
  async addProject(@Param('code') codeOrg: string, @Param('codeProject') codeProject: string) {
    return await this.organizationService.addProject(codeOrg, codeProject);
  }

  @ApiOkResponse({ description: 'Success' })
  @Put(':id')
  @UsePipes(ValidationPipe)
  async edit(@Body() dto: EditOrganizationDTO, @Param('id') id: number) {
    return await this.organizationService.editOrganization(id, dto);
  }

  @ApiOkResponse({ description: 'Success' })
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.organizationService.removeOrganization(id);
  }

  @Delete(':code/removeProject/:codeProject')
  async removeProjectInOrg(@Param('codeProject') codeProject: string, @Param('code') code: string) {
    return await this.organizationService.removeProject(code, codeProject);
  }
}
