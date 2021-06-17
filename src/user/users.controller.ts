import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AddUserDTO } from './dto/add-user.dto';
import { NotFoundExceptionFilter } from '../common/exception-filter/not-found.filter';
import { ParseDataToIntPipe } from '../common/pipe/parse-to-int.pipe';
import { TokenUserDTO } from './dto/token-user.dto';
// import { Public } from '../decorators/public.decorator';
import { ApiTags } from '@nestjs/swagger';
import { EditUserDTO } from './dto/edit-user.dto';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async getUser(@Param('id') id: number) {
    return await this.usersService.getOneByIdOrFail(id);
  }

  @Get()
  async getAllUsers() {
    return await this.usersService.getAllUser();
  }

  @Get('verifyToken')
  async verifyToken(@Body() token: TokenUserDTO): Promise<unknown> {
    return await this.usersService.verifyToken(token);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createUsers(@Body() dto: AddUserDTO) {
    return await this.usersService.create(dto);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  async update(@Body() dto: EditUserDTO, @Param('id') id: number) {
    return await this.usersService.update(id, dto);
  }

  @Delete(':id')
  @UseFilters(NotFoundExceptionFilter)
  async deleteUser(@Param('id') id: number) {
    return await this.usersService.destroy(id);
  }

  @Get(':id/groups')
  @UseFilters(new NotFoundExceptionFilter())
  async getAllGroup(@Param('id', ParseDataToIntPipe) idUser: number) {
    return await this.usersService.getAllGroupOfUser(idUser);
  }
}
