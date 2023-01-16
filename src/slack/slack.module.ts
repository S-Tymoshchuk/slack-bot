import { Module } from '@nestjs/common';
import { SlackService } from './slack.service';
import { SlackRepository } from './slack.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserEntity } from './entities/user.entity';

@Module({
  controllers: [],
  imports: [SequelizeModule.forFeature([UserEntity])],
  providers: [SlackService, SlackRepository],
  exports: [SlackService],
})
export class SlackModule {}
