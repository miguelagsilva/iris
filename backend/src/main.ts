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
    .setDescription(`
      # Authentication and Permissions

      This API uses the following authentication and permission levels:

      - **Public**: No authentication required
      - **User**: Requires a valid JWT token
      - **Admin**: Requires a valid JWT token with admin role
      - **Organization Member**: Requires a valid JWT token and membership in the specific organization

      Each endpoint in this documentation specifies its required permission level in the description.
    `)
    .addTag('Public', 'Endpoints that do not require authentication')
    .addTag('User', 'Endpoints that require user authentication')
    .addTag('Admin', 'Endpoints that require admin privileges')
    .addTag('Organization', 'Endpoints that require organization membership')
    .addTag('auth', 'Auth related endpoints')
    .addTag('users', 'User related endpoints')
    .addTag('organizations', 'Organization related endpoints')
    .addTag('groups', 'Group related endpoints')
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
