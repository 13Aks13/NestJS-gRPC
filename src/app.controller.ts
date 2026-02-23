import { Controller, Get, Query } from '@nestjs/common';
import { ChatClientService } from './chat.client';
import { AppService } from './app.service';

@Controller('test-chat')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly chatClient: ChatClientService,
  ) {}

  @Get('send')
  async testSend(@Query('text') text: string) {
    const message = text || 'Hello gRPC!';
    await this.chatClient.sendMessage(message);
    return { message: `I've got your message ${message}` };
  }
}
