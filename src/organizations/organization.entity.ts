
import { Length } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ProjectEntity } from 'src/projects/project.entity';

@Entity('organization')
export class OrganizationEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  @Length(10, 20)
  name: string;
  
  @ApiProperty()
  @Column()
  @Length(4, 20)
  codeId: string;
  
  @OneToMany(() => ProjectEntity, project => project.organization)
  projects: ProjectEntity[];


  
}
