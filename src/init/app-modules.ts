import { Logger } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import configuration from '../config/configuration';
import { ConfigModule } from '@nestjs/config';
import { UserEntity } from '../slack/entities/user.entity';

export const initAppModules = [
  ConfigModule.forRoot({
    isGlobal: true,
    load: [configuration],
  }),
  SequelizeModule.forRoot({
    username: process.env.PG_USER,
    password: process.env.PG_PASS,
    database: process.env.PG_BASE,
    host: process.env.PG_HOST,
    port: parseInt(process.env.PG_PORT),
    dialect: 'postgres',
    define: {
      timestamps: true,
      underscored: true,
    },
    logging: (message) => {
      Logger.debug(message);
    },
    synchronize: true,
    autoLoadModels: true,
    models: [UserEntity],
  }),
];
