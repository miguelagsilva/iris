import { forwardRef, Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { GroupsModule } from '../groups/groups.module';
import { ConfigModule } from '@nestjs/config';
import { ThreadsModule } from './threads/threads.module';
import { AssistantsModule } from './assistants/assistants.module';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => GroupsModule),
    forwardRef(() => AssistantsModule),
    forwardRef(() => ThreadsModule),
  ],
  providers: [AiService],
  controllers: [AiController],
  exports: [AiService],
})
export class AiModule {}
