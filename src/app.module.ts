import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { GroupsModule } from './group/group.module';
import { AddressModule } from './users/address/address.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { UsersController } from './users/users.controller';
// import { AddAddressDTO } from './users/dto/add-address.dto';
// import { AddressService } from './users/add/address.service';
// import { AddressEntity } from './users/add/address.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3307,
      username: 'root',
      password: 'secret',
      database: 'blogdb',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UsersModule,
    GroupsModule,
    AddressModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(UsersController);
  }
}
