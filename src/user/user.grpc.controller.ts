import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { UserService } from './user.service';
import type {
  CreateUserRequest,
  GetUserRequest,
  GetUserByEmailRequest,
  ListUsersRequest,
  UserResponse,
  ListUsersResponse,
} from './interfaces/user-grpc.interface';

@Controller()
export class UserGrpcController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserService', 'CreateUser')
  async createUser(data: CreateUserRequest): Promise<UserResponse> {
    try {
      const user = await this.userService.create({
        email: data.email,
        password: data.password,
        name: data.name || undefined,
      });
      return this.toUserResponse(user);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'CreateUser failed';
      throw new RpcException({ code: status.ALREADY_EXISTS, message });
    }
  }

  @GrpcMethod('UserService', 'GetUser')
  async getUser(data: GetUserRequest): Promise<UserResponse> {
    const user = await this.userService.findById(data.id);
    if (!user) {
      throw new RpcException({ code: status.NOT_FOUND, message: 'User not found' });
    }
    return this.toUserResponse(user);
  }

  @GrpcMethod('UserService', 'GetUserByEmail')
  async getUserByEmail(data: GetUserByEmailRequest): Promise<UserResponse> {
    const user = await this.userService.findByEmail(data.email);
    if (!user) {
      throw new RpcException({ code: status.NOT_FOUND, message: 'User not found' });
    }
    return this.toUserResponse(this.userService.toPublicUser(user));
  }

  @GrpcMethod('UserService', 'ListUsers')
  async listUsers(_data: ListUsersRequest): Promise<ListUsersResponse> {
    const users = await this.userService.findAll();
    return {
      users: users.map((u) => this.toUserResponse(u)),
    };
  }

  private toUserResponse(user: {
    id: string;
    email: string;
    name: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): UserResponse {
    return {
      id: user.id,
      email: user.email,
      name: user.name ?? '',
      created_at: user.createdAt instanceof Date ? user.createdAt.toISOString() : String(user.createdAt),
      updated_at: user.updatedAt instanceof Date ? user.updatedAt.toISOString() : String(user.updatedAt),
    };
  }
}
