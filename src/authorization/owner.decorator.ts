import { SetMetadata } from '@nestjs/common';
import { Owner } from './owner.enum';
export const OWNER_KEY = 'owner';
export const Owners = (...owner: Owner[]) => SetMetadata(OWNER_KEY, owner);
