import OpenAI from 'openai';
import { BadRequestException, Injectable } from '@nestjs/common';
import { GroupsService } from '../groups/groups.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiService {
  public openai: OpenAI;
  constructor(
    private groupsService: GroupsService,
    private readonly configService: ConfigService,
  ) {
    this.openai = new OpenAI({
      apiKey: configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async sendMessage(assistantId: string, threadId: string, message: string) {
    const createdMessage = await this.openai.beta.threads.messages.create(
      threadId,
      {
        role: 'user',
        content:
          'I need to solve the equation `3x + 11 = 14`. Can you help me?',
      },
    );
  }

  async run(assistantId: string, threadId: string) {
    const run = this.openai.beta.threads.runs
      .stream(threadId, {
        assistant_id: assistantId,
      })
      .on('textCreated', (text) => process.stdout.write('\nassistant > '))
      .on('textDelta', (textDelta, snapshot) =>
        process.stdout.write(textDelta.value),
      )
      .on('toolCallCreated', (toolCall) =>
        process.stdout.write(`\nassistant > ${toolCall.type}\n\n`),
      )
      .on('toolCallDelta', (toolCallDelta, snapshot) => {
        if (toolCallDelta.type === 'code_interpreter') {
          if (toolCallDelta.code_interpreter.input) {
            process.stdout.write(toolCallDelta.code_interpreter.input);
          }
          if (toolCallDelta.code_interpreter.outputs) {
            process.stdout.write('\noutput >\n');
            toolCallDelta.code_interpreter.outputs.forEach((output) => {
              if (output.type === 'logs') {
                process.stdout.write(`\n${output.logs}\n`);
              }
            });
          }
        }
      });
  }

  async streamCompletion(prompt: string) {
    if (!prompt || prompt.trim() === '') {
      throw new BadRequestException('Prompt cannot be empty');
    }

    try {
      const stream = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        stream: true,
      });

      return stream;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new BadRequestException('Failed to process the request');
    }
  }
}
