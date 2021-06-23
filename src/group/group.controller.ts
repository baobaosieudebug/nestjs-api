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
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { EditGroupDTO } from './dto/edit-group.dto';
import { AddGroupDTO } from './dto/add-group.dto';

@ApiTags('Group')
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get(':id')
  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server' })
  async getOne(@Param('id') idGroup: number) {
    return await this.groupsService.getOneOrFail(idGroup);
  }

  @Get()
  @ApiOkResponse({ description: 'Success' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server' })
  async getAll() {
    return await this.groupsService.getAll();
  }

  @Get('/:id/users')
  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server' })
  async getAllUserByID(@Param('id') id: number) {
    return await this.groupsService.getAllUserByID(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  @ApiCreatedResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server' })
  async createGroup(@Body() dto: AddGroupDTO) {
    return await this.groupsService.createGroup(dto);
  }

  @Post(':id/addUser/:idUser')
  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server' })
  async addUser(@Param('idUser') idUser: number, @Param('id') idGroup: number) {
    return await this.groupsService.addUser(idUser, idGroup);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server' })
  async update(@Body() group: EditGroupDTO, @Param('id') id: number) {
    return await this.groupsService.update(id, group);
  }

  @Delete(':id/removeUser/:idUser')
  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server' })
  async removeUserInGroup(
    @Param('idUser') idUser: number,
    @Param('id') idGroup: number,
  ) {
    return await this.groupsService.removeUserInGroup(idUser, idGroup);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server' })
  async remove(@Param('id') id: number) {
    return await this.groupsService.remove(id);
  }
}
