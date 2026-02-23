import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, Transport } from '@nestjs/microservices';
import type { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { join } from 'path';
import { ChatService, Message, Empty } from './chat/interfaces/chat.interface';

@Injectable()
export class ChatClientService implements OnModuleInit {
  @Client({
    transport: Transport.GRPC,
    options: {
      package: 'chat',
      protoPath: join(__dirname, './chat.proto'),
      url: '127.0.0.1:5010',
    },
  })
  private client: ClientGrpc;

  private chatService: ChatService;

  onModuleInit() {
    this.chatService = this.client.getService<ChatService>('ChatService');
  }

  async sendMessage(content: string): Promise<Empty> {
    const message: Message = { content };
    return lastValueFrom(this.chatService.sendMessage(message));
  }
}
