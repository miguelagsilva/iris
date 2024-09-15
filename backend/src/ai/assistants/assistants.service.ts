import { ConflictException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAssistantDto } from './dto/create-assistant.dto';
import { SafeAssistantDto } from './dto/safe-assistant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assistant } from './entities/assistant.entity';
import { GroupsService } from 'src/groups/groups.service';
import { AiService } from '../ai.service';

@Injectable()
export class AssistantsService {
  constructor(
    @Inject(forwardRef(() => AiService))
    private aiService: AiService,
    @Inject(forwardRef(() => GroupsService))
    private groupsService: GroupsService,
    @InjectRepository(Assistant)
    private assistantsRepository: Repository<Assistant>,
  ) {}

  private async checkAssistantExistence(groupId: string) {
    const group = await this.groupsService.findOne(groupId);
    const existingAssistant = await this.assistantsRepository.findOne({
      where: { group: group },
    });
    if (existingAssistant) {
      throw new ConflictException(
        'That grou alread has an assistant exists.',
      );
    }
  }

  async getAssistant(id: string): Promise<Assistant> {
    const assistant = await this.assistantsRepository.findOne({
      where: { id: id },
      relations: ['threads', 'group'],
    });
    if (!assistant) {
      throw new NotFoundException(`Assistant with id "${id}" not found`);
    }
    return assistant;
  }


  async create(createAssistantDto: CreateAssistantDto): Promise<SafeAssistantDto> {
    await this.checkAssistantExistence(createAssistantDto.groupId);
    const { groupId, ...newEmployee } = createAssistantDto;
    const group = await this.groupsService.getGroup(groupId);
    const createdOpenAIAssitantId = await this.createOpenAIAssistant(group.name);
    const createdAssistant = this.assistantsRepository.create({
      ...newEmployee,
      group,
      openai_id: createdOpenAIAssitantId,
    });
    await this.assistantsRepository.save(createdAssistant);
    return this.findOne(createdAssistant.id);
  }

  async findAll(): Promise<SafeAssistantDto[]> {
    const assistants = await this.assistantsRepository.find();
    return assistants.map((assistant) => assistant.toSafeAssistant());
  }

  async findOne(id: string): Promise<SafeAssistantDto> {
    const assistant = await this.getAssistant(id);
    return assistant.toSafeAssistant();
  }

  async remove(id: string): Promise<SafeAssistantDto> {
    const assistant = await this.getAssistant(id);
    await this.assistantsRepository.softDelete(id);
    return assistant.toSafeAssistant();
  }

  async restore(id: string): Promise<SafeAssistantDto> {
    await this.assistantsRepository.restore(id);
    return this.findOne(id);
  }

  private async createOpenAIAssistant(name: string): Promise<string> {
    const assistant = await this.aiService.openai.beta.assistants.create({
      name: name,
      instructions: "És uma secretária pessoal para trabalhadores no setor da construção civil. Pesquisa os ficheiros pela informação solicitada. Caso tenhas alguma dúvida no que te é pedido deves questionar o utilizador sobre o seu pedido. Responde em português de portugal. Não respondas sobre outros temas não relacionados é construção civil e o contexto dos ficheiros que tens acesso.",
      tools: [{ type: "file_search" }],
      model: "gpt-4o",
      temperature: 0.5,
    });
    if (!assistant.id) {
      throw new Error('Failed to create OpenAI assistant');
    }
    return assistant.id;
  }
}
