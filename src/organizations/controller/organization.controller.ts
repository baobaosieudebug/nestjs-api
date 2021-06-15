import { Delete, Get, Param, Put, UseFilters } from '@nestjs/common';
import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { NotFoundExceptionFilter } from 'src/common/exception filter/not-found.filter';
import { AddOrganizationDTO } from 'src/organizations/dto/add-organization.dto';
import { EditOrganizationDTO } from 'src/organizations/dto/edit-organization.dto';
import { OrganizationService } from '../service/organization.service';

@ApiTags('Organization')
@Controller('organization')
export class OrganizationController {
  constructor(private organizationService: OrganizationService) {}

  @Get()
  @ApiOkResponse({ description: 'Get List Organization Success' })
  async getAllOrganization() {
    return await this.organizationService.getAllOrganization();
  }

  @ApiOkResponse({ description: 'Get Organization Success' })
  @ApiNotFoundResponse({ description: 'ID Organization Not Found' })
  @Get(':id')
  async getOrganizationByIdOrFail(@Param('id') id: number) {
    return await this.organizationService.getOneByIdOrFail(id);
  }

  @ApiUnauthorizedResponse({ description: 'You need to login ' })
  @Post()
  async createArticle(@Body() dto: AddOrganizationDTO) {
    return await this.organizationService.createOrganization(dto);
  }

  @Post(':codeIdOrganization/addProject/:codeIdProject')
  async addProject(
    @Param('codeIdOrganization') codeIdOrganization: number,
    @Param('codeIdProject') codeIdProject: number,
  ) {
    return await this.organizationService.addProject(
      codeIdOrganization,
      codeIdProject,
    );
  }

  @ApiOkResponse({ description: 'Edit Organization Success' })
  @Put()
  async editOrganization(@Body() dto: EditOrganizationDTO) {
    return await this.organizationService.editOrganization(dto);
  }

  @ApiOkResponse({ description: 'Get Organization Success' })
  @ApiNotFoundResponse({ description: 'ID Organization Not Found' })
  @UseFilters(NotFoundExceptionFilter)
  @Delete(':id')
  async removeOrganization(@Param('id') id: number) {
    return await this.organizationService.deleteOrganization(id);
  }
}
