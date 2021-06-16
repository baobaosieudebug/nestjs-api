import {
  Delete,
  Get,
  Param,
  Put,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NotFoundExceptionFilter } from '../common/exception-filter/not-found.filter';
import { AddOrganizationDTO } from '../organization/dto/add-organization.dto';
import { EditOrganizationDTO } from '../organization/dto/edit-organization.dto';
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

  @Post()
  @UsePipes(ValidationPipe)
  async createOrganization(@Body() dto: AddOrganizationDTO) {
    return await this.organizationService.createOrganization(dto);
  }

  @Post(':codeIdOrganization/addProject/:codeIdProject')
  async addProject(
    @Param('codeIdOrganization') codeIdOrganization: string,
    @Param('codeIdProject') codeIdProject: string,
  ) {
    return await this.organizationService.addProject(
      codeIdOrganization,
      codeIdProject,
    );
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  async editOrganization(
    @Body() dto: EditOrganizationDTO,
    @Param('id') id: number,
  ) {
    return await this.organizationService.editOrganization(id, dto);
  }

  @UseFilters(NotFoundExceptionFilter)
  @Delete(':id')
  async removeOrganization(@Param('id') id: number) {
    return await this.organizationService.deleteOrganization(id);
  }
}
