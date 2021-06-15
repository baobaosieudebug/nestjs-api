import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { GroupsEntity } from 'src/group/entity/group.entity';
import { OrganizationEntity } from 'src/organizations/entity/organization.entity';

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

  @ManyToMany(() => GroupsEntity, (group: GroupsEntity) => group.projects, {
    cascade: ['insert'],
  })
  @JoinTable()
  groups: GroupsEntity[];

  @ManyToOne(
    () => OrganizationEntity,
    (organization: OrganizationEntity) => organization.projects,
  )
  organization: OrganizationEntity;
}
