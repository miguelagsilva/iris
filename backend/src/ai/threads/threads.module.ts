import { forwardRef, Module } from '@nestjs/common';
import { ThreadsService } from './threads.service';
import { ThreadsController } from './threads.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Thread } from './entities/thread.entity';
import { AiModule } from '../ai.module';
import { AssistantsModule } from '../assistants/assistants.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Thread]),
    forwardRef(() => AiModule),
    forwardRef(() => AssistantsModule),
  ],
  controllers: [ThreadsController],
  providers: [ThreadsService],
  exports: [ThreadsService],
})
export class ThreadsModule {}
