import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: ['chat', 'user', 'auth'],
      protoPath: [
        join(__dirname, './chat.proto'),
        join(__dirname, './user.proto'),
        join(__dirname, './auth.proto'),
      ],
      url: '0.0.0.0:5010',
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000);

  console.log('✅ HTTP Bridge running on: http://localhost:3000');
  console.log('🚀 gRPC Microservice listening on: 127.0.0.1:5010');
}
bootstrap();
