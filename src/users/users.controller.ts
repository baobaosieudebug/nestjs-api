import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseFilters,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AddUserDTO } from './dto/add-user.dto';
import { UserNotFoundExceptionFilter } from 'src/exception filter/usernotfound.filter';
import { ValidationPipe } from 'src/pipe/validation.pipe';
import { AddressService } from './address/address.service';
import { AddAddressDTO } from './dto/add-address.dto';
import { AddressEntity } from './address/address.entity';

@Controller('users')
@UseFilters(new UserNotFoundExceptionFilter())
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private addressService: AddressService,
  ) {}

  @Get()
  async showAllUsers() {
    return await this.usersService.showAll();
  }

  @Get(':idUser/getAllGroup')
  async getAllGroup(@Param('idUser') idUser: number) {
    return await this.usersService.getAllGroup(idUser);
  }

  @Get(':id')
  async getUser(@Param('id') id: number) {
    return await this.usersService.getOneByIdOrFail(id);
  }

  @Get()
  async getUserById(id) {
    return await this.usersService.getOneById(id);
  }

  @Post()
  async createUsers(@Body(new ValidationPipe()) user: AddUserDTO) {
    return await this.usersService.create(user);
  }

  @Post(':idUser/userJoinGroup/:idGroup')
  async userJoinGroup(
    @Param('idUser') idUser: number,
    @Param('idGroup') idGroup: number,
  ) {
    return await this.usersService.userJoinGroup(idUser, idGroup);
  }

  @Post(':idUser/groupJoinByUser/:idGroup')
  async groupJoinByUser(
    @Param('idUser') idUser: number,
    @Param('idGroup') idGroup: number,
  ) {
    return await this.usersService.groupJoinByUser(idUser, idGroup);
  }

  @Put(':id')
  async update(@Body() user: AddUserDTO, @Param('id') id: number) {
    return await this.usersService.update(id, user);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    return await this.usersService.destroy(id);
  }
  //Crud Address
  @Post('add-address')
  async createAddress(@Body() address: AddressEntity) {
    return await this.addressService.createAddress(address);
  }
}
