import { Controller, Param, ParseUUIDPipe, Post, Query, Res, Sse } from '@nestjs/common';
import { AiService } from './ai.service';
import { map, Observable } from 'rxjs';

interface StreamResponse {
  content?: string;
  done?: boolean;
  error?: string;
}

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Sse('stream')
  streamResponse(@Query('prompt') prompt: string): Observable<MessageEvent> {
    if (!prompt) {
      return new Observable<StreamResponse>(observer => {
        observer.next({ error: 'Prompt is required' });
        observer.complete();
      }).pipe(
        map(data => ({ data } as MessageEvent))
      );
    }

    return new Observable<StreamResponse>(observer => {
      this.aiService.streamCompletion(prompt)
        .then(async stream => {
          try {
            for await (const chunk of stream) {
              const content = chunk.choices[0]?.delta?.content || '';
              if (content) {
                observer.next({ content });
              }
            }
            observer.next({ done: true });
          } catch (error) {
            console.error('Stream processing error:', error);
            observer.next({ error: 'An error occurred while processing the stream' });
          } finally {
            observer.complete();
          }
        })
        .catch(error => {
          console.error('AI service error:', error);
          observer.next({ error: 'An error occurred while initiating the AI service' });
          observer.complete();
        });
    }).pipe(
      map(data => ({ data } as MessageEvent))
    );
  }
}
