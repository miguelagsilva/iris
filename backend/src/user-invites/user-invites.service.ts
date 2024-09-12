import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { UserInvite } from './user-invite.entity';
import { CreateUserInviteDto } from './dto/create-user-invite.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class UserInvitesService {
  constructor(
    @InjectRepository(UserInvite)
    private userInvitesRepository: Repository<UserInvite>,
  ) {}

  private async getUserInvite(id: string): Promise<UserInvite> {
    const userInvite = await this.userInvitesRepository.findOne({
      where: { id: id },
    });
    if (!userInvite) {
      throw new NotFoundException(`User invite with id "${id}" not found`);
    }
    return userInvite;
  }

  async create(createUserInviteDto: CreateUserInviteDto): Promise<UserInvite> {
    const expiredAt = new Date((new Date().getTime()) + createUserInviteDto.expirationTime);
    const newUserInvite = new UserInvite();
    newUserInvite.expiredAt = expiredAt;
    const savedUser = await this.userInvitesRepository.save({ ...createUserInviteDto, ...newUserInvite});
    return await this.getUserInvite(savedUser.id);
  }

  async findOne(id: string): Promise<UserInvite> {
    return await this.getUserInvite(id);
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async deleteExpiredInvites() {
    const now = new Date();
    await this.userInvitesRepository.delete({
      expiredAt: LessThan(now),
    });
  }
}
