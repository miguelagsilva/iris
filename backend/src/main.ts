import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import 'reflect-metadata';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('OpenAPI')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'bearer',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);

  Object.values(document.paths).forEach((path: any) => {
    Object.values(path).forEach((method: any) => {
      if (!method.responses) {
        method.responses = {};
      }
      method.responses['400'] = { description: 'Bad Request' };
      method.responses['401'] = { description: 'Unauthorized' };
      method.responses['403'] = { description: 'Forbidden' };
      method.responses['404'] = { description: 'Content not found' };
      method.responses['500'] = { description: 'Internal Server Error' };
    });
  });

  SwaggerModule.setup('swagger', app, document, {
    jsonDocumentUrl: 'swagger/json',
  });

  await app.listen(process.env.PORT);
}
bootstrap();
