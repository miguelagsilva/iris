import { forwardRef, Module } from '@nestjs/common';
import { AssistantsService } from './assistants.service';
import { AssistantsController } from './assistants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assistant } from './entities/assistant.entity';
import { GroupsModule } from 'src/groups/groups.module';
import { AiModule } from '../ai.module';
import { ThreadsModule } from '../threads/threads.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Assistant]),
    forwardRef(() => GroupsModule),
    forwardRef(() => ThreadsModule),
    forwardRef(() => AiModule),
  ],
  controllers: [AssistantsController],
  providers: [AssistantsService],
  exports: [AssistantsService],
})
export class AssistantsModule {}
