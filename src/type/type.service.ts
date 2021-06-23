import { Injectable } from '@nestjs/common';
import { TypeRepository } from './type.repository';

@Injectable()
export class TypeService {
  constructor(private readonly typeRepo: TypeRepository) {}
}
