import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Insurance API')
    .setDescription('A mini insurance API built with Nest.js')
    .setVersion('1.0')
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app as any, config);
  SwaggerModule.setup('api', app as any, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
