import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { OrganizationEntity } from 'src/organization/organization.entity';

@Entity('project')
export class ProjectEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar' })
  name: string;

  @ApiProperty()
  @Column({ type: 'varchar' })
  codeId: string;

  @Column({ name: 'is_delete', type: 'varchar', default: null })
  isDelete: number;

  @ManyToOne(
    () => OrganizationEntity,
    (organization: OrganizationEntity) => organization.projects,
  )
  organization: OrganizationEntity;
}
