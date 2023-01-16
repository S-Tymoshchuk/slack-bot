import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ExpressReceiver } from '@slack/bolt';
import { ConfigService } from '@nestjs/config';
import { Initializer } from './init/initializer';

async function bootstrap() {
  const receiver = new ExpressReceiver({
    signingSecret: process.env.SECRET,
    endpoints: { commands: '/slack/events' },
  });

  const app = await NestFactory.create(AppModule);

  const logger = new Logger('bootstrap');

  const configService = app.get(ConfigService);

  const initializer = new Initializer(app, configService);

  app.useLogger(logger);

  const appModule = app.get(AppModule);
  appModule.initSlack(receiver);

  await appModule.checkUser();

  app.use(receiver.router);

  initializer.run();

  const PORT = process.env.PORT || 8000;

  await app.listen(PORT);

  logger.log(`App is listening on port ${PORT}`);
}
bootstrap();
