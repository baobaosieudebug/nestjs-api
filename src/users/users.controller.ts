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
  UseGuards,
  HttpService,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AddUserDTO } from '../dto/add-user.dto';
import { UserNotFoundExceptionFilter } from 'src/auth/exception filter/usernotfound.filter';
import { AddressService } from './address/address.service';
import { AddAddressDTO } from '../dto/add-address.dto';
import { AddressEntity } from './address/address.entity';
import { EditAddressDTO } from '../dto/edit-address.dto';
import { ParseDataToIntPipe } from 'src/auth/pipe/parse-to-int.pipe';
import { LoginUserDTO } from '../dto/login-user.dto';
import { TokenUserDTO } from '../dto/token-user.dto';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/auth/roles/role.enum';
import { CaslAbilityFactory } from 'src/article/casl/casl-ability.factory';
import { UsersEntity } from './users.entity';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { response } from 'express';

//Proeject mới
@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private addressService: AddressService,
  ) {}

  @Get()
  @ApiOkResponse({ description: 'Get a list users success' })
  async showAllUsers() {
    return await this.usersService.showAll();
  }

  @Get('getAListUserAndVerifyToken')
  async getListUserAndVerifyToken(
    @Body() token: TokenUserDTO,
  ): Promise<unknown> {
    return await this.usersService.getListUserAndVerifyToken(token);
  }

  @Get(':idUser/getAllGroup')
  @UseFilters(new UserNotFoundExceptionFilter())
  async getAllGroup(@Param('idUser', ParseDataToIntPipe) idUser: number) {
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

  @Get()
  async getUserByEmail(email: string) {
    return await this.usersService.getUserByEmail(email);
  }

  @Public()
  @Post()
  @UsePipes(ValidationPipe)
  @ApiCreatedResponse({ description: 'Create user success' })
  @ApiUnauthorizedResponse({ description: 'You are Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'The server is having error' })
  @ApiBadRequestResponse({ description: 'One Of Params is incorrect' })
  async createUsers(@Body() user: AddUserDTO) {
    return await this.usersService.create(user);
  }

  @Post(':idUser/userJoinGroup/:idGroup')
  @ApiUnauthorizedResponse({ description: 'You are Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'The server is having error' })
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
  @ApiOkResponse({ description: 'Update information of user success' })
  @ApiUnauthorizedResponse({ description: 'You are Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'The server is having error' })
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

  @Public()
  @ApiBody({ type: AddAddressDTO })
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
