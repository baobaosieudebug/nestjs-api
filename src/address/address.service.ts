import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { AddressEntity } from './address.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>,
  ) {}

  // async showAll(User:UsersEntity) : Promise<AddressEntity[]>{
  //   let result = Array(new AddressEntity());
  //   result = await this.addressRepository.find({id:User.id});
  //   return await result.author;

  // }

  async createAddress(idUser, address: AddressEntity) {
    const newAddress = new AddressEntity();
    newAddress.nameAddress = address.nameAddress;
    newAddress.author = idUser;
    return await this.addressRepository.save(newAddress);
  }

  async updateAddress(id: number, address: AddressEntity) {
    return await this.addressRepository.update(id, address);
  }

  async destroy(id: number): Promise<DeleteResult> {
    return await this.addressRepository.delete(id);
  }
}
