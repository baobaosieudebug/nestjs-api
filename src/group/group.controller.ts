import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseFilters,
} from '@nestjs/common';
import { GroupsService } from './group.service';
import { GroupsEntity } from './group.entity';
import { groupNotFoundExceptionFilter } from 'src/exception-filter/groupNotFound.filter';

@Controller('groups')
@UseFilters(new groupNotFoundExceptionFilter())
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get(':id')
  async getOneGroup(@Param() params) {
    return await this.groupsService.getOneGroupOrFail(params);
  }

  @Get()
  async getManyGroup() {
    return await this.groupsService.showAll();
  }
  @Get(':idGroup/getAllUser')
  async getAllUser(@Param('idGroup') idGroup: number) {
    return await this.groupsService.getAllUserOfOneGroup(idGroup);
  }
  @Post()
  async createGroup(@Body() group: GroupsEntity) {
    return await this.groupsService.createGroup(group);
  }

  @Put(':id')
  async update(@Body() group: GroupsEntity, @Param('id') id: number) {
    return await this.groupsService.update(id, group);
  }
  @Delete(':idUser/deleteUser/:idGroup')
  async deleteUserInGroup(
    @Param('idUser') idUser: number,
    @Param('idGroup') idGroup: number,
  ) {
    return await this.groupsService.deleteUserInGroup(idUser, idGroup);
  }
  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    return await this.groupsService.destroy(id);
  }
}
