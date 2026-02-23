import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import * as chatInterface from './interfaces/chat.interface';

@Controller()
export class ChatController {
  private messages: string[] = [];

  @GrpcMethod('ChatService', 'SendMessage')
  sendMessage(data: chatInterface.Message): chatInterface.Empty {
    console.log(`Received message: ${data.content}`);
    this.messages.push(data.content);
    console.log(`Current messages: ${this.messages.join(', ')}`);
    return {};
  }
}
