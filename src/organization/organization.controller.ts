import {
  Delete,
  Get,
  Param,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  Body,
  Controller,
  Post,
} from '@nestjs/common';
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
import { HandleOrganizationRO } from './ro/handle-organization.ro';
import { HandleProjectRO } from '../project/ro/handle-project.ro';
import { RolesGuard } from '../auth/role.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from '../config/storage.config';

@ApiTags('Organization')
@ApiNotFoundResponse({ description: 'Not Found' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
@Controller('organization')
export class OrganizationController {
  constructor(private organizationService: OrganizationService) {}

  @ApiOkResponse({ description: 'Success' })
  @UseGuards(RolesGuard)
  @Get()
  async getOneById(@Req() req): Promise<HandleOrganizationRO> {
    const org = await this.organizationService.checkOwner(req);
    return this.organizationService.handleOrganizationResponse(org);
  }

  @ApiOkResponse({ description: 'Success' })
  @Get('code/:code')
  async getOneTaskByCode(@Param('code') code: string): Promise<HandleOrganizationRO> {
    const organization = await this.organizationService.getOneByCodeOrFail(code);
    return this.organizationService.handleOrganizationResponse(organization);
  }

  @ApiOkResponse({ description: 'Success' })
  @Get(':id/projects')
  async getAllProjectById(@Param('id') id: number): Promise<HandleProjectRO[]> {
    return await this.organizationService.getAllProjectById(id);
  }

  @ApiCreatedResponse({ description: 'Created' })
  @UseGuards(RolesGuard)
  // @Roles(Role.Admin)
  @Post()
  @UsePipes(ValidationPipe)
  async create(@Req() req, @Body() dto: AddOrganizationDTO): Promise<HandleOrganizationRO> {
    return await this.organizationService.create(req, dto);
  }

  @ApiOkResponse({ description: 'Success' })
  @Post(':code/addProject/:codeProject')
  async addProject(
    @Param('code') codeOrg: string,
    @Param('codeProject') codeProject: string,
  ): Promise<HandleProjectRO> {
    return await this.organizationService.addProject(codeOrg, codeProject);
  }

  @ApiOkResponse({ description: 'Success' })
  @UseGuards(RolesGuard)
  @UsePipes(ValidationPipe)
  @Put()
  async edit(@Req() req, @Body() dto: EditOrganizationDTO): Promise<HandleOrganizationRO> {
    return await this.organizationService.edit(req, dto);
  }

  @ApiOkResponse({ description: 'Success' })
  @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor('file', storage))
  @Put('/logo')
  async updateLogo(@Req() req, @UploadedFile() file: Express.Multer.File): Promise<HandleOrganizationRO> {
    return await this.organizationService.uploadLogo(req, file);
  }

  @ApiOkResponse({ description: 'Success' })
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<number> {
    return await this.organizationService.delete(id);
  }

  @Delete(':code/removeProject/:codeProject')
  async removeProjectInOrg(
    @Param('codeProject') codeProject: string,
    @Param('code') code: string,
  ): Promise<HandleProjectRO> {
    return await this.organizationService.removeProject(code, codeProject);
  }
}
