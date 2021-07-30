import { Get, Put, UsePipes, ValidationPipe, Body, Controller, Post, Param, Delete } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Payload } from '../decorators/payload.decorator';
import { OrganizationService } from './organization.service';
import { AddOrganizationDTO } from './dto/add-organization.dto';
import { EditOrganizationDTO } from './dto/edit-organization.dto';
import { OrganizationRO } from './ro/organization.ro';
import { UserRO } from '../user/ro/user.ro';

@ApiTags('Organization')
@ApiNotFoundResponse({ description: 'Not Found' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
@Controller('organization')
export class OrganizationController {
  constructor(private organizationService: OrganizationService) {}

  @ApiOkResponse({ description: 'Success' })
  @Get(':code')
  async getOne(@Payload() payload, @Param('code') code: string): Promise<OrganizationRO> {
    const org = await this.organizationService.getOneOrFail(payload, code);
    return this.organizationService.mappingOrganizationRO(org);
  }

  @ApiOkResponse({ description: 'Success' })
  @Get(':domain/users')
  async getListUser(@Payload() payload, @Param('domain') domain: string): Promise<UserRO[]> {
    return await this.organizationService.getListUser(payload, domain);
  }

  @ApiCreatedResponse({ description: 'Created' })
  @Post()
  @UsePipes(ValidationPipe)
  async create(@Payload() payload, @Body() dto: AddOrganizationDTO): Promise<OrganizationRO> {
    return await this.organizationService.create(payload, dto);
  }

  @ApiOkResponse({ description: 'Success' })
  @Post(':domain/invite')
  async inviteOrg(@Payload() payload, @Param('domain') domain: string) {
    return await this.organizationService.invite(payload, domain);
  }

  @ApiOkResponse({ description: 'Success' })
  @UsePipes(ValidationPipe)
  @Put()
  async edit(@Payload() payload, @Body() dto: EditOrganizationDTO): Promise<OrganizationRO> {
    return await this.organizationService.edit(payload, dto);
  }

  // @ApiOkResponse({ description: 'Success' })
  // @UseGuards(RolesGuard)
  // @UseInterceptors(FileInterceptor('file', storage))
  // @Put('/logo')
  // async updateLogo(@Req() req, @UploadedFile() file: Express.Multer.File): Promise<OrganizationRO> {
  //   return await this.organizationService.uploadLogo(req, file);
  // }

  @ApiOkResponse({ description: 'Success' })
  @Delete(':code')
  async delete(@Payload() payload, @Param('code') code: string): Promise<number> {
    return await this.organizationService.delete(payload, code);
  }

  @ApiOkResponse({ description: 'Success' })
  @Get(':code/projects')
  async getListProject(@Payload() payload, @Param('code') code: string) {
    return await this.organizationService.getListProject(payload, code);
  }
}
