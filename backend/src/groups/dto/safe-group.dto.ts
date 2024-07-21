import { PickType } from '@nestjs/swagger';
import { Group } from '../group.entity';

export class SafeGroupDto extends PickType(Group, ['id', 'name', 'organization'] as const) {
  static fromGroup(group: Group): SafeGroupDto {
    const { id, name, organization } = group;
    return { id, name, organization }; 
  }
}
