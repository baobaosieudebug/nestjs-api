import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { AddAddressDTO } from '../../dto/add-address.dto';
import { EditAddressDTO } from '../../dto/edit-address.dto';
import { AddressEntity } from './address.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>,
  ) {}

  async getAddreess(id: number) {
    return await this.addressRepository.findOne(id);
  }
  async getAddressOrFail(id: number) {
    if (id == null) {
      throw new HttpException('ID User Not Found', HttpStatus.NOT_FOUND);
    } else {
      return await this.getAddreess(id);
    }
  }
  async getAll() {
    return await this.addressRepository.find();
  }
  async createAddress(address: AddressEntity): Promise<AddressEntity> {
    return await this.addressRepository.save(address);
  }

  async updateAddress(id: number, address: EditAddressDTO) {
    return await this.addressRepository.update(id, address);
  }

  async destroy(id: number): Promise<DeleteResult> {
    return await this.addressRepository.delete(id);
  }
}
