import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ProjectEntity } from '../project/project.entity';

@Entity('organization')
export class OrganizationEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar' })
  name: string;

  @ApiProperty()
  @Column({ type: 'varchar' })
  code: string;

  @Column({ name: 'is_deleted', type: 'varchar', default: null })
  isDeleted: number;

  @OneToMany(
    () => ProjectEntity,
    (project: ProjectEntity) => project.organization,
  )
  projects: ProjectEntity[];
}
