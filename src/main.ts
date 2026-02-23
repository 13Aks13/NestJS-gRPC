import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('gRPC Chat Service API')
    .setDescription('HTTP API for chat, auth and user microservices')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

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
      loader: { keepCase: true },
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000);

  console.log('✅ HTTP Bridge running on: http://localhost:3000');
  console.log('📚 Swagger: http://localhost:3000/swagger');
  console.log('🚀 gRPC Microservice listening on: 127.0.0.1:5010');
}
bootstrap();
