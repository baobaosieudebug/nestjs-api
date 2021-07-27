import { EntityRepository, Repository } from 'typeorm';
import { ActionEntity } from '../entities/action.entity';

@EntityRepository(ActionEntity)
export class ActionRepository extends Repository<ActionEntity> {
  async getIdByCode(code: string, resourceId: number) {
    const action = await this.findOne({ code, resourceId });
    return action.id;
  }
}
