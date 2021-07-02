import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule as NestConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { authConfig, authConfigSchema } from './auth.config';
import { databaseConfig, databaseConfigSchema } from './database.config';

@Module({})
export class ConfigModule {
  static forRoot(): DynamicModule {
    return {
      module: ConfigModule,
      imports: [
        NestConfigModule.forRoot({
          isGlobal: true,
          load: [authConfig, databaseConfig],
          validationSchema: Joi.object({
            ...authConfigSchema,
            ...databaseConfigSchema,
          }),
        }),
      ],
      providers: [ConfigService],
      exports: [ConfigService],
    };
  }
}
