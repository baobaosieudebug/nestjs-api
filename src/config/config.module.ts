import { Module, DynamicModule } from '@nestjs/common';
import {
  ConfigModule as NestConfigModule,
  ConfigService,
} from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { authConfig, authConfigSchema } from './auth.config';

@Module({})
export class ConfigModule {
  static forRoot(): DynamicModule {
    return {
      module: ConfigModule,
      imports: [
        NestConfigModule.forRoot({
          isGlobal: true,
          load: [authConfig],
          validationSchema: Joi.object({
            ...authConfigSchema,
          }),
        }),
      ],
      providers: [ConfigService],
      exports: [ConfigService],
    };
  }
}
