import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChatClientService } from './chat.client';
import { AppService } from './app.service';

@ApiTags('Test Chat')
@Controller('test-chat')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly chatClient: ChatClientService,
  ) {}

  @Get('send')
  @ApiOperation({ summary: 'Send a message via gRPC chat' })
  @ApiQuery({ name: 'text', required: false, description: 'Message to send' })
  @ApiResponse({ status: 200, description: 'Message sent', schema: { properties: { message: { type: 'string' } } } })
  async testSend(@Query('text') text: string) {
    const message = text || 'Hello gRPC!';
    await this.chatClient.sendMessage(message);
    return { message: `I've got your message ${message}` };
  }
}
