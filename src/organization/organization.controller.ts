import {
  Delete,
  Get,
  Param,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
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
@ApiOkResponse({ description: 'Success' })
@ApiCreatedResponse({ description: 'Created' })
@ApiNotFoundResponse({ description: 'Not Found' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
@Controller('organization')
export class OrganizationController {
  constructor(private organizationService: OrganizationService) {}

  @Get()
  async getAllOrganization() {
    return await this.organizationService.getAllOrganization();
  }

  @Get(':id')
  async getOrganizationByIdOrFail(@Param('id') id: number) {
    return await this.organizationService.getOneByIdOrFail(id);
  }

  @Get('code/:code')
  async getOneTaskByCode(@Param('code') code: string) {
    return await this.organizationService.getOneByCodeOrFail(code);
  }

  @Get(':id/projects')
  async getAllProjectById(@Param('id') id: number) {
    return await this.organizationService.getAllProjectById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() dto: AddOrganizationDTO) {
    return await this.organizationService.createOrganization(dto);
  }

  @Post(':code/addProject/:codeProject')
  async addProject(
    @Param('code') codeOrg: string,
    @Param('codeProject') codeProject: string,
  ) {
    return await this.organizationService.addProject(codeOrg, codeProject);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  async edit(@Body() dto: EditOrganizationDTO, @Param('id') id: number) {
    return await this.organizationService.editOrganization(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.organizationService.removeOrganization(id);
  }

  @Delete(':code/removeProject/:codeProject')
  async removeProjectInOrg(
    @Param('codeProject') codeProject: string,
    @Param('code') code: string,
  ) {
    return await this.organizationService.removeProject(code, codeProject);
  }
}
