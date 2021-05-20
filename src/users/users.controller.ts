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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AddUserDTO } from './dto/add-user.dto';
import { UserNotFoundExceptionFilter } from 'src/exception filter/usernotfound.filter';
// import { ValidationPipe } from 'src/pipe/validation.pipe';
import { AddressService } from './address/address.service';
import { AddAddressDTO } from './dto/add-address.dto';
import { AddressEntity } from './address/address.entity';
import { EditAddressDTO } from './dto/edit-address.dto';
import { ParseDataToIntPipe } from 'src/pipe/parse-to-int.pipe';

@Controller('users')
// @UseFilters(new UserNotFoundExceptionFilter())
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
  async getUser(@Param('id', ParseDataToIntPipe) id: number) {
    return await this.usersService.getOneByIdOrFail(id);
  }

  @Get()
  async getUserById(id) {
    return await this.usersService.getOneById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createUsers(@Body() user: AddUserDTO) {
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
  @Get('address/:id')
  async getAddress(@Param('id') id: number) {
    return await this.addressService.getAddressOrFail(id);
  }
  @Get('address')
  async getAll() {
    return await this.addressService.getAll();
  }
  @Get(':idUser/address')
  async getAddressByIdUser(@Param('idUser') idUser: number) {
    return await this.usersService.getAddressByIdUser(idUser);
  }
  @Post('add-address')
  async createAddress(@Body() address: AddAddressDTO) {
    const newAddress = new AddressEntity();
    const user = await this.usersService.getOneByIdOrFail(address.userCreatead);
    newAddress.id = user.id;
    newAddress.city = address.city;
    newAddress.district = address.district;
    newAddress.ward = address.ward;
    newAddress.nameAddress = address.nameAddress;
    newAddress.author = user;
    return await this.addressService.createAddress(newAddress);
  }
  @Put('address/:id')
  async editAddress(@Param('id') id: number, @Body() address: EditAddressDTO) {
    return await this.addressService.updateAddress(id, address);
  }
  @Delete('address/:id')
  async removeAddress(@Param('id') id: number) {
    return await this.addressService.destroy(id);
  }
}
