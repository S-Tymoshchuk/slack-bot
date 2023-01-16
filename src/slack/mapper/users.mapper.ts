import { UserEntity } from '../entities/user.entity';
import { RoleMapper } from './role.mapper';

export class UsersMapper {
  static getResponseUser(users: UserEntity[]) {
    return users.map((el, index) => ({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `${index + 1}. <@${
          el.name
        }>; Date add: ${el.createdAt.toLocaleString()}; ROLE: ${
          RoleMapper[el.role]
        }`,
      },
    }));
  }
}
