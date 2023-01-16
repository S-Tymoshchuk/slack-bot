import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export class Initializer {
  public constructor(
    private readonly app: INestApplication,
    private readonly configService: ConfigService,
  ) {}

  public run(): void {
    this.initBaseConfig();
  }

  private initBaseConfig(): void {
    this.app.setGlobalPrefix('api');
  }
}
