import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInvite } from './user-invite.entity';
import { UserInvitesService } from './user-invites.service';
import { UserInvitesController } from './user-invites.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserInvite])],
  providers: [UserInvitesService],
  controllers: [UserInvitesController],
  exports: [TypeOrmModule],
})
export class UserInvitesModule {}
