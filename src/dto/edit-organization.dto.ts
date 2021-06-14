import { PartialType } from '@nestjs/swagger';
import { AddOrganizationDTO } from './add-organization.dto';

export class EditOrganizationDTO extends PartialType(AddOrganizationDTO) {}
