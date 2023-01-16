import { Injectable, Logger } from '@nestjs/common';
import { WebClient } from '@slack/web-api';
import { SlackRepository } from './slack.repository';
import { UsersMapper } from './mapper/users.mapper';
import { UserMock } from './const/admin-const';
import { UserRoles } from './enum/user-roles-enum';

@Injectable()
export class SlackService {
  private logger = new Logger();
  private webClient: WebClient;
  constructor(private readonly slackRepository: SlackRepository) {
    this.webClient = new WebClient(process.env.TOKEN);
  }

  initSlackCommand(boltApp): void {
    boltApp.command('/add-user', async ({ command, ack }) => {
      const userAdded = command.text.slice(1);

      const checkPermission = await this.checkPermission(command.user_name);

      if (!checkPermission) {
        return ack({
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `<@${command.user_name}> don't have permissions add user`,
              },
            },
          ],
        });
      }

      const user = await this.slackRepository.adduser(userAdded);

      if (!user) {
        return ack({
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `User <@${userAdded}> is already exist`,
              },
            },
          ],
        });
      }

      return ack({
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `User added <@${userAdded}>`,
            },
          },
        ],
      });
    });

    boltApp.command('/list-users', async ({ command, ack }) => {
      const users = await this.slackRepository.getUsers();

      const checkPermission = await this.checkPermission(command.user_name);

      if (!checkPermission) {
        return ack({
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `<@${command.user_name}> don't have permissions view a list`,
              },
            },
          ],
        });
      }

      return ack({
        blocks: [...UsersMapper.getResponseUser(users)],
      });
    });

    boltApp.command('/remove-user', async ({ command, ack }) => {
      const user = command.text.slice(1);

      const checkPermission = await this.checkPermission(command.user_name);

      if (!checkPermission) {
        return ack({
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `<@${command.user_name}> don't have permissions remove user`,
              },
            },
          ],
        });
      }

      const findUser = await this.slackRepository.getUserByName(user);

      if (!findUser) {
        return ack({
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `User <@${user}> not found `,
              },
            },
          ],
        });
      }

      if (Number(findUser.role) === Number(UserRoles.superAdmin)) {
        return ack({
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `You can't remove the super admin user <@${user}>`,
              },
            },
          ],
        });
      }

      await this.slackRepository.removeUser(user);

      return ack({
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `User was deleted <@${user}>`,
            },
          },
        ],
      });
    });

    boltApp.command('/create-chanel', async ({ command, ack }) => {
      const user = command.user_name;

      const checkPermission = await this.slackRepository.getUserByName(user);

      if (!checkPermission) {
        return ack({
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `<@${user}> don't have permissions to create a new channel`,
              },
            },
          ],
        });
      }

      const result = await this.webClient.conversations.create({
        name: command.text,
        description: '',
        is_private: true,
      });

      await this.webClient.conversations.invite({
        channel: result.channel.id,
        users: command.user_id,
      });

      return ack({
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `Channel was created <@${result.channel.name_normalized}>`,
            },
          },
        ],
      });
    });

    boltApp.command('/change-role', async ({ command, ack }) => {
      const user = command.text.slice(1);
      const userName = command.user_name;

      const findUser = await this.slackRepository.getUserByName(userName);

      if (Number(findUser.role) === Number(UserRoles.superAdmin)) {
        await this.slackRepository.changeRole(user);

        return ack({
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `<@${user}> change role to admin`,
              },
            },
          ],
        });
      }

      return ack({
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `<@${command.user_name}> don't have permissions to change role`,
            },
          },
        ],
      });
    });
  }

  async checkPermission(userName: string): Promise<boolean> {
    return Boolean(
      await this.slackRepository.getUserByName(userName, [
        UserRoles.admin,
        UserRoles.superAdmin,
      ]),
    );
  }

  async checkUser(): Promise<void> {
    const userCheck = await this.slackRepository.getAdmin();

    if (!userCheck) {
      await this.slackRepository.createAdmin(UserMock);
    }

    this.logger.log('Admin mock');
  }
}
