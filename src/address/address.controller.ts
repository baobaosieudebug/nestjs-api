import { Controller, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressEntity } from './address.entity';
import { UpdateResult } from 'typeorm';

@Controller('')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  // @Get('address')
  // async getAllAddress(@Body() user: UsersEntity) {
  //   return await this.addressService.showAll(user);
  // }
  @Post(':idUser/address')
  async createAddress(
    @Param('idUser') idUser: number,
    @Body() address: AddressEntity,
  ) {
    return await this.addressService.createAddress(idUser, address);
  }

  @Put('address')
  async updateAddress(@Body() address: AddressEntity): Promise<UpdateResult> {
    return await this.addressService.updateAddress(address.id, address);
  }

  @Delete('address/:id')
  async deleteUser(@Param('id') id: number) {
    return await this.addressService.destroy(id);
  }
}
