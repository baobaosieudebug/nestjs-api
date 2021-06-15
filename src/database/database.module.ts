import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../config/config.module';

@Module({})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            type: 'mysql',
            host: configService.get<string>('db.host'),
            port: configService.get<number>('db.port'),
            username: configService.get<string>('db.username'),
            password: configService.get<string>('db.password'),
            database: configService.get<string>('db.database'),
            entities: ['dist/**/*.entity{.ts,.js}'],
            synchronize: false, //this is a auto drop record when you restart server: https://docs.nestjs.com/techniques/database(typeorm intergration/warning)
            logging: configService.get<boolean>('db.logging'),
          }),
        }),
      ],
      exports: [TypeOrmModule],
    };
  }
}
