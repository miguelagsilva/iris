import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import 'reflect-metadata';
import * as session from 'express-session';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Session } from './auth/session.entity';
import { TypeOrmSessionStore } from './auth/typeorm-session.store';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);

  // Sessions

  const sessionRepository = app.get(getRepositoryToken(Session));
  const sessionStore = new TypeOrmSessionStore(sessionRepository);
  const sessionOptions = {
    store: sessionStore,
    secret: configService.get<string>('SESSIONS_SECRET'),
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: process.env.NODE_ENV == 'production',
      secure: process.env.NODE_ENV == 'production',
    },
  };

  app.use(session({ ...sessionOptions, name: 'user_session_id' }));
  app.use(session({ ...sessionOptions, name: 'admin_session_id' }));
  app.use(session({ ...sessionOptions, name: 'employee_session_id' }));

  // Swagger

  const config = new DocumentBuilder()
    .setTitle('OpenAPI')
    .setDescription(
      `
      # Authentication and Permissions

      This API uses the following authentication and permission levels:

      - **Public**: No authentication required
      - **User** 
      - **Admin**
      - **Organization Member**

      Each endpoint in this documentation specifies its required permission level in the description.
    `,
    )
    .addTag('Public', 'Endpoints that do not require authentication')
    .addTag('User', 'Endpoints that require user authentication')
    .addTag('Admin', 'Endpoints that require admin privileges')
    .addTag('Organization', 'Endpoints that require organization membership')
    .addTag('auth', 'Auth related endpoints')
    .addTag('users', 'User related endpoints')
    .addTag('organizations', 'Organization related endpoints')
    .addTag('groups', 'Group related endpoints')
    .setVersion('1.0')
    .addCookieAuth('user_session_id', {
      type: 'apiKey',
      in: 'cookie',
      name: 'user_session_id',
    })
    .addCookieAuth('admin_session_id', {
      type: 'apiKey',
      in: 'cookie',
      name: 'admin_session_id',
    })
    .addCookieAuth('employee_session_id', {
      type: 'apiKey',
      in: 'cookie',
      name: 'employee_session_id_session_id',
    })
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
