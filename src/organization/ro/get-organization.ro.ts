import { Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export class GetOrganizationRO {
  @ApiProperty()
  @Column({ type: 'varchar' })
  name: string;

  @ApiProperty()
  @Column({ type: 'varchar' })
  code: string;
}
