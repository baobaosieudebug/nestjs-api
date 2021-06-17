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
  codeId: string;

  @Column({ name: 'is_deleted', type: 'varchar', default: null })
  isDelete: number;

  @OneToMany(
    () => ProjectEntity,
    (project: ProjectEntity) => project.organization,
  )
  projects: ProjectEntity[];
}
