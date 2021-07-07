import { Get, Put, UsePipes, ValidationPipe, Body, Controller, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OrganizationService } from './organization.service';
import { AddOrganizationDTO } from './dto/add-organization.dto';
import { EditOrganizationDTO } from './dto/edit-organization.dto';
import { OrganizationRO } from './ro/organization.ro';
import { Payload } from '../decorators/payload.decorator';

@ApiTags('Organization')
@ApiNotFoundResponse({ description: 'Not Found' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
@Controller('organization')
export class OrganizationController {
  constructor(private organizationService: OrganizationService) {}

  @ApiOkResponse({ description: 'Success' })
  @Get()
  async getOne(@Payload() payload): Promise<OrganizationRO> {
    const org = await this.organizationService.getOneOrFail(payload);
    return this.organizationService.mappingOrganizationRO(org);
  }

  @ApiCreatedResponse({ description: 'Created' })
  @Post()
  @UsePipes(ValidationPipe)
  async create(@Payload() payload, @Body() dto: AddOrganizationDTO): Promise<OrganizationRO> {
    return await this.organizationService.create(payload, dto);
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

  // @ApiOkResponse({ description: 'Success' })
  // @Delete(':id')
  // async delete(@Param('id') id: number): Promise<number> {
  //   return await this.organizationService.delete(id);
  // }
}
