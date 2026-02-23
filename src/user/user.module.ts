import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserGrpcController } from './user.grpc.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController, UserGrpcController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
