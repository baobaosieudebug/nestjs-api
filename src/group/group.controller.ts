import { Controller, Get, Post, Put, Delete, Body, Param, ValidationPipe, UsePipes } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { EditGroupDTO } from './dto/edit-group.dto';
import { AddGroupDTO } from './dto/add-group.dto';
import { GroupsService } from './group.service';

@ApiTags('Group')
@ApiNotFoundResponse({ description: 'Not Found' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @ApiOkResponse({ description: 'Success' })
  @Get(':id')
  async getOne(@Param('id') idGroup: number) {
    return await this.groupsService.getOneOrFail(idGroup);
  }

  @ApiOkResponse({ description: 'Success' })
  @Get()
  async getAll() {
    return await this.groupsService.getAll();
  }

  @ApiOkResponse({ description: 'Success' })
  @Get('/:id/users')
  async getAllUserById(@Param('id') id: number) {
    return await this.groupsService.getAllUserById(id);
  }

  @ApiCreatedResponse({ description: 'Created' })
  @Post()
  @UsePipes(ValidationPipe)
  async createGroup(@Body() dto: AddGroupDTO) {
    return await this.groupsService.createGroup(dto);
  }

  @ApiOkResponse({ description: 'Success' })
  @Post(':id/addUser/:idUser')
  async addUser(@Param('idUser') idUser: number, @Param('id') idGroup: number) {
    return await this.groupsService.addUser(idUser, idGroup);
  }

  @ApiOkResponse({ description: 'Success' })
  @Put(':id')
  @UsePipes(ValidationPipe)
  async update(@Body() group: EditGroupDTO, @Param('id') id: number) {
    return await this.groupsService.update(id, group);
  }

  @ApiOkResponse({ description: 'Success' })
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.groupsService.remove(id);
  }
}
