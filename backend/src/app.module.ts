import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validate } from './config/env.validation';
import { OrganizationsModule } from './organizations/organizations.module';
import { GroupsModule } from './groups/groups.module';
import { EmployeesModule } from './employees/employees.module';
import { AuthModule } from './auth/auth.module';
import { Session } from './auth/session.entity';
import { APP_GUARD } from '@nestjs/core';
import dataSourceOptions from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
      validate,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({...dataSourceOptions(configService), autoLoadEntities: true}),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 30000,
        limit: 20,
      },
    ]),
    TypeOrmModule.forFeature([Session]),
    AuthModule,
    UsersModule,
    OrganizationsModule,
    GroupsModule,
    EmployeesModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    /*
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: OrganizationGuard,
    },
    */
  ],
})
export class AppModule {}
