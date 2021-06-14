import { Delete, Get, Param, Put, UseFilters } from '@nestjs/common';
import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { NotFoundExceptionFilter } from 'src/auth/exception filter/not-found.filter';
import { AddOrganizationDTO } from 'src/dto/add-organization.dto';
import { EditOrganizationDTO } from 'src/dto/edit-organization.dto';
import { OrganizationService } from './organization.service';

//Proeject mới
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

  @Get('restore/:id')
  async restoreOrganization(@Param('id') id: number) {
    return await this.organizationService.restoreOganization(id);
  }

  @ApiUnauthorizedResponse({ description: 'You need to login ' })
  @Post()
  async createArticle(@Body() organization: AddOrganizationDTO) {
    return await this.organizationService.createOrganization(organization);
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
  async editOrganization(@Body() organization: EditOrganizationDTO) {
    return await this.organizationService.editOrganization(organization);
  }

  @ApiOkResponse({ description: 'Get Organization Success' })
  @ApiNotFoundResponse({ description: 'ID Organization Not Found' })
  @UseFilters(NotFoundExceptionFilter)
  @Delete(':id')
  async removeOrganization(@Param('id') id: number) {
    return await this.organizationService.softDelete(id);
  }
}
