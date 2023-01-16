import {
  Column,
  DataType,
  Default,
  Model,
  Table,
  Unique,
} from 'sequelize-typescript';
import { UUIDV4 } from 'sequelize';
import { UserRoles } from '../enum/user-roles-enum';

@Table({ tableName: 'users' })
export class UserEntity extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Default(UserRoles.manager)
  @Column
  role: UserRoles;

  @Unique
  @Column
  name: string;
}
