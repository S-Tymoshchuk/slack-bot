import { Optional } from 'sequelize';
import { UserRoles } from '../enum/user-roles-enum';

export interface IAdminMock extends Optional<any, string> {
  name: string;
  role: UserRoles;
}

export const UserMock: IAdminMock = {
  name: 'oleksandr.bezhentsev',
  role: UserRoles.superAdmin,
};
