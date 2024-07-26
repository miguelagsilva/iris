import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validate } from './env.validation';
import { JwtModule } from '@nestjs/jwt';
import { OrganizationsModule } from './organizations/organizations.module';
import { GroupsModule } from './groups/groups.module';
import { EmployeesModule } from './employees/employees.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
      validate,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: configService.get<any>('DB_TYPE'),
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASS'),
        database: configService.get<string>('DB_NAME'),
        synchronize: configService.get<boolean>('DB_SYNC'),
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 30000,
        limit: 20,
      },
    ]),
    JwtModule,
    AuthModule,
    UsersModule,
    OrganizationsModule,
    GroupsModule,
    EmployeesModule,
  ],
  /*
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
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
  ],
  */
})
export class AppModule {}
