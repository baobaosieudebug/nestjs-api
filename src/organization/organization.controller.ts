import {
  Delete,
  Get,
  Param,
  Put,
  // UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
// import { NotFoundExceptionFilter } from '../common/exception-filter/not-found.filter';
import { AddOrganizationDTO } from './dto/add-organization.dto';
import { EditOrganizationDTO } from './dto/edit-organization.dto';
import { OrganizationService } from './organization.service';

@ApiTags('Organization')
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
  async getAllProjectByID(@Param('id') id: number) {
    return await this.organizationService.getAllProjectByID(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createOrganization(@Body() dto: AddOrganizationDTO) {
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
  async editOrganization(
    @Body() dto: EditOrganizationDTO,
    @Param('id') id: number,
  ) {
    return await this.organizationService.editOrganization(id, dto);
  }

  // @UseFilters(NotFoundExceptionFilter)
  @Delete(':id')
  async removeOrganization(@Param('id') id: number) {
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
