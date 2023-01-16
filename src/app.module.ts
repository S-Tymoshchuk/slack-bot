import { Module } from '@nestjs/common';
import { SlackModule } from './slack/slack.module';
import { App } from '@slack/bolt';
import { SlackService } from './slack/slack.service';
import { initAppModules } from './init/app-modules';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [...initAppModules, SlackModule],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(
    private readonly slackService: SlackService,
    private readonly configService: ConfigService,
  ) {}
  initSlack(receiver) {
    const boltApp = new App({
      token: this.configService.get('TOKEN'),
      signingSecret: this.configService.get('SECRET'),
      scopes: '',
      receiver,
    });
    this.slackService.initSlackCommand(boltApp);
  }

  async checkUser() {
    await this.slackService.checkUser();
  }
}
