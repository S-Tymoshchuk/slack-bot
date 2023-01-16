import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserEntity } from './entities/user.entity';
import { IAdminMock } from './const/admin-const';
import { UserRoles } from './enum/user-roles-enum';

@Injectable()
export class SlackRepository {
  private logger = new Logger();
  constructor(
    @InjectModel(UserEntity)
    private readonly usersModel: typeof UserEntity,
  ) {}

  async adduser(user: string): Promise<UserEntity> {
    try {
      return await this.usersModel.create({ name: user });
    } catch (e) {
      this.logger.log(e);
    }
  }

  getUsers(): Promise<UserEntity[]> {
    return this.usersModel.findAll({ order: [['createdAt', 'DESC']] });
  }

  async removeUser(name: string): Promise<void> {
    await this.usersModel.destroy({ where: { name } });
  }

  getUserByName(name: string, role?: UserRoles[]): Promise<UserEntity> {
    const filter = role ? { role, name } : { name };
    return this.usersModel.findOne({ where: { ...filter } });
  }

  getAdmin(): Promise<UserEntity> {
    return this.usersModel.findOne({
      where: {
        role: UserRoles.superAdmin,
      },
    });
  }

  createAdmin(admin: IAdminMock): Promise<UserEntity> {
    return this.usersModel.create(admin);
  }

  async changeRole(user: string): Promise<void> {
    await this.usersModel.update(
      { role: UserRoles.admin },
      { where: { name: user } },
    );
  }
}
