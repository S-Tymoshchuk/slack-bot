import { UserRoles } from '../enum/user-roles-enum';

export const RoleMapper = {
  [UserRoles.admin]: 'Admin',
  [UserRoles.superAdmin]: 'SuperAdmin',
  [UserRoles.manager]: 'Manager',
};
