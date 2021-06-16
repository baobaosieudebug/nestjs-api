import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { OrganizationEntity } from 'src/organizations/organization.entity';

@Entity('project')
export class ProjectEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  codeId: string;

  @Column({ type: 'varchar', length: 255, default: null })
  isDelete: number;

  @ManyToOne(
    () => OrganizationEntity,
    (organization: OrganizationEntity) => organization.projects,
  )
  organization: OrganizationEntity;
}
