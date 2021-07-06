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
import { GetOrganizationRO } from './ro/get-organization.ro';
import { GetProjectRO } from '../project/ro/get-project.ro';
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

  // @ApiOkResponse({ description: 'Success' })
  // @UseGuards(RolesGuard)
  // @Roles(Role.Admin)
  // @Get()
  // async getAll(): Promise<GetOrganizationRO[]> {
  //   return await this.organizationService.getAll();
  // }

  @ApiOkResponse({ description: 'Success' })
  @UseGuards(RolesGuard)
  @Get()
  async getOneById(@Req() req) {
    const org = await this.organizationService.checkOwner(req);
    return await this.organizationService.handleOrganizationResponse(org);
  }

  @ApiOkResponse({ description: 'Success' })
  @Get('code/:code')
  async getOneTaskByCode(@Param('code') code: string): Promise<GetOrganizationRO> {
    const organization = await this.organizationService.getOneByCodeOrFail(code);
    return await this.organizationService.handleOrganizationResponse(organization);
  }

  @ApiOkResponse({ description: 'Success' })
  @Get(':id/projects')
  async getAllProjectById(@Param('id') id: number): Promise<GetProjectRO[]> {
    return await this.organizationService.getAllProjectById(id);
  }

  @ApiCreatedResponse({ description: 'Created' })
  @UseGuards(RolesGuard)
  // @Roles(Role.Admin)
  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() dto: AddOrganizationDTO, @Req() req) {
    return await this.organizationService.create(dto, req);
  }

  @ApiOkResponse({ description: 'Success' })
  @Post(':code/addProject/:codeProject')
  async addProject(
    @Param('code') codeOrg: string,
    @Param('codeProject') codeProject: string,
  ): Promise<HandleProjectRO> {
    return await this.organizationService.addProject(codeOrg, codeProject);
  }

  // @ApiOkResponse({ description: 'Success' })
  // @UseGuards(RolesGuard)
  // @UsePipes(ValidationPipe)
  // @Put()
  // async edit(@Body() dto: EditOrganizationDTO, @Req() req): Promise<HandleOrganizationRO> {
  //   return await this.organizationService.edit(dto, req);
  // }

  // @ApiOkResponse({ description: 'Success' })
  // @UseGuards(RolesGuard)
  // @UseInterceptors(FileInterceptor('file', storage))
  // @Put('/logo')
  // async updateLogo(@Req() req, @UploadedFile() file: Express.Multer.File) {
  //   return await this.organizationService.uploadLogo(req, file);
  // }

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
