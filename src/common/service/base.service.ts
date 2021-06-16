import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';

export class BaseService<childRepo> {
  constructor(private repo: Repository<childRepo>) {}

  getAll(): Promise<childRepo[]> {
    return this.repo.find();
  }

  getOneById(id: number): Promise<childRepo> {
    return this.repo.findOne(id);
  }

  getOneByCodeId(codeId: string): Promise<childRepo> {
    return this.repo.findOne({ where: [{ codeId: codeId }] });
  }

  async getOneByIdOrFail(id: number): Promise<childRepo> {
    const responseEntity = await this.getOneById(id);
    if (!responseEntity) {
      throw new NotFoundException('ID Incorrect');
    }
    return responseEntity;
  }

  async getOneByCodeIdOrFail(codeId: string) {
    const responseEntity = await this.getOneByCodeId(codeId);
    if (!responseEntity) {
      throw new NotFoundException('ID Incorrect');
    }
    return responseEntity;
  }

  async add(dto) {
    try {
      const responseEntity = this.repo.create(dto);
      return await this.repo.save(responseEntity);
    } catch (e) {
      throw new InternalServerErrorException('Sorry, Server is being problem');
    }
  }

  async edit(id: number, dto): Promise<childRepo> {
    const old = await this.getOneByIdOrFail(id);
    try {
      const editEntity = this.repo.merge(old, dto);
      return this.repo.save(editEntity);
    } catch (e) {
      throw new InternalServerErrorException('Sorry, Server is being problem');
    }
  }

  async remove(id: number) {
    const removeEntity = await this.getOneByIdOrFail(id);
    try {
      await this.repo.delete(removeEntity);
      return id;
    } catch (e) {
      throw new InternalServerErrorException('Sorry, Server is being problem');
    }
  }
}
