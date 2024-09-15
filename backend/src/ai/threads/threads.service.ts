import { ConflictException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateThreadDto } from './dto/create-thread.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Thread } from './entities/thread.entity';
import { AiService } from '../ai.service';
import { AssistantsService } from '../assistants/assistants.service';
import { SafeThreadDto } from './dto/safe-thread.dto';

@Injectable()
export class ThreadsService {
  constructor(
    @Inject(forwardRef(() => AiService))
    private aiService: AiService,
    @Inject(forwardRef(() => AssistantsService))
    private assistantsService: AssistantsService,
    @InjectRepository(Thread)
    private threadsRepository: Repository<Thread>,
  ) {}

  private async checkThreadExistence(assistantId: string) {
    const assistant = await this.assistantsService.findOne(assistantId);
    const existingThread = await this.threadsRepository.findOne({
      where: { assistant: assistant },
    });
    if (existingThread) {
      throw new ConflictException(
        'That grou alread has an thread exists.',
      );
    }
  }

  private async getThread(id: string): Promise<Thread> {
    const thread = await this.threadsRepository.findOne({
      where: { id: id },
      relations: ['threads', 'assistant'],
    });
    if (!thread) {
      throw new NotFoundException(`Thread with id "${id}" not found`);
    }
    return thread;
  }


  async create(createThreadDto: CreateThreadDto): Promise<SafeThreadDto> {
    await this.checkThreadExistence(createThreadDto.assistantId);
    const { assistantId, ...newEmployee } = createThreadDto;
    const assistant = await this.assistantsService.getAssistant(assistantId);
    const createdOpenAIThreadId = await this.createOpenAIThread();
    const createdThread = this.threadsRepository.create({
      ...newEmployee,
      assistant,
      openai_id: createdOpenAIThreadId,
    });
    await this.threadsRepository.save(createdThread);
    return this.findOne(createdThread.id);
  }

  async findAll(): Promise<SafeThreadDto[]> {
    const threads = await this.threadsRepository.find();
    return threads.map((thread) => thread.toSafeThread());
  }

  async findOne(id: string): Promise<SafeThreadDto> {
    const thread = await this.getThread(id);
    return thread.toSafeThread();
  }

  async remove(id: string): Promise<SafeThreadDto> {
    const thread = await this.getThread(id);
    await this.threadsRepository.softDelete(id);
    return thread.toSafeThread();
  }

  async restore(id: string): Promise<SafeThreadDto> {
    await this.threadsRepository.restore(id);
    return this.findOne(id);
  }

  async findThreadByAssistantIdAndEmployeeId(
    assistantId: string,
    employeeId: string,
  ): Promise<SafeThreadDto> {
    const thread = await this.threadsRepository.findOne({
      where: { assistant: { id: assistantId }, employee: { id: employeeId } },
    });
    if (!thread) {
      throw new NotFoundException(
        `Thread with assistantId "${assistantId}" and employeeId "${employeeId}" not found`,
      );
    }
    return thread.toSafeThread();
  }

  private async createOpenAIThread(): Promise<string> {
    const thread = await this.aiService.openai.beta.threads.create();
    if (!thread.id) {
      throw new Error('Failed to create OpenAI thread');
    }
    return thread.id;
  }
}
