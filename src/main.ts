import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from 'aws-sdk';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  // const reflector = app.get(Reflector);
  // app.useGlobalGuards(new JwtAuthGuard(reflector));
  config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_ACCESS_KEY,
    region: process.env.AWS_BUCKET_REGION,
  });
  const swagger = new DocumentBuilder()
    .setTitle('Get-started-project')
    .setDescription('DBS Get started project for NestJS API')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, swagger);

  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT || 3002);
}
bootstrap();
