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
  async getOne(@Param('id') idGroup: number) {
    return await this.groupsService.getOneOrFail(idGroup);
  }

  @Get()
  async getAll() {
    return await this.groupsService.getAll();
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createGroup(@Body() dto: AddGroupDTO) {
    return await this.groupsService.createGroup(dto);
  }

  // @Post(':id/addUser/:idUser')
  // async addUser(@Param('idUser') idUser: number, @Param('id') idGroup: number) {
  //   return await this.groupsService.addUser(idUser, idGroup);
  // }

  @Put(':id')
  @UsePipes(ValidationPipe)
  async update(@Body() group: EditGroupDTO, @Param('id') id: number) {
    return await this.groupsService.update(id, group);
  }

  @Delete(':id/removeUser/:idUser')
  async removeUserInGroup(
    @Param('idUser') idUser: number,
    @Param('id') idGroup: number,
  ) {
    return await this.groupsService.removeUserInGroup(idUser, idGroup);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.groupsService.remove(id);
  }
}
