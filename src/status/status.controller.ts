import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { StatusService } from './status.service';
import { AddStatusDTO } from './dto/add-status.dto';
import { EditStatusDTO } from './dto/edit-status.dto';

@ApiTags('Status')
@ApiOkResponse({ description: 'Success' })
@ApiCreatedResponse({ description: 'Created' })
@ApiNotFoundResponse({ description: 'Not Found' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
@Controller('projects/:id/statuses')
export class StatusController {
  constructor(private statusService: StatusService) {}

  @Get()
  async getAll(@Param('id') idProject: number) {
    return await this.statusService.getAll(idProject);
  }

  // @Get(':idStatus')
  // async getStatusById(
  //   @Param('idStatus') id: number,
  //   @Param('id') idProject: number,
  // ) {
  //   return await this.statusService.getOneByIdOrFail(id, idProject);
  // }
  //
  // @Post()
  // @UsePipes(ValidationPipe)
  // async createStatus(
  //   @Body() dto: AddStatusDTO,
  //   @Param('id') idProject: number,
  // ) {
  //   return await this.statusService.add(dto, idProject);
  // }
  //
  // @Put(':idStatus')
  // @UsePipes(ValidationPipe)
  // async editStatus(
  //   @Param('id') idProject: number,
  //   @Param('idStatus') id: number,
  //   @Body() dto: EditStatusDTO,
  // ) {
  //   return await this.statusService.edit(id, idProject, dto);
  // }
  //
  // @Delete(':idStatus')
  // async removeStatus(
  //   @Param('id') idProject: number,
  //   @Param('idStatus') id: number,
  // ) {
  //   return await this.statusService.remove(id, idProject);
  // }
}
