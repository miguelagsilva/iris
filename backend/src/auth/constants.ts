import { ConfigService } from '@nestjs/config';

export class jwtConstants {
  constructor(private configService: ConfigService) {}

  get_secret() {
    return { secret: this.configService.get<string>('JWT_SECRET') };
  }
}
