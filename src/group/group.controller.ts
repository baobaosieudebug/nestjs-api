import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { GroupsService } from './group.service';
import { ApiTags } from '@nestjs/swagger';
import { EditGroupDTO } from './dto/edit-group.dto';
import { AddGroupDTO } from './dto/add-group.dto';

@ApiTags('Group')
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get(':id')
  async getOneGroup(@Param('id') idGroup: number) {
    return await this.groupsService.getOneGroupOrFail(idGroup);
  }

  @Get()
  async getManyGroup() {
    return await this.groupsService.getAllGroup();
  }

  @Get(':idGroup/getAllUser')
  async getAllUser(@Param('idGroup') idGroup: number) {
    return await this.groupsService.getAllUserOfOneGroup(idGroup);
  }

  @Get(':idGroup/getTask')
  async getAllTask(@Param('idGroup') idGroup: number) {
    return await this.groupsService.getAllTaskByIdGroup(idGroup);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createGroup(@Body() dto: AddGroupDTO) {
    return await this.groupsService.createGroup(dto);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  async update(@Body() group: EditGroupDTO, @Param('id') id: number) {
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
