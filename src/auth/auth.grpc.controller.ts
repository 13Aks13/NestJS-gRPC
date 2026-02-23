import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { AuthService } from './auth.service';
import type {
  RegisterRequest,
  LoginRequest,
  ValidateRequest,
  AuthResponse,
  ValidateResponse,
} from './interfaces/auth-grpc.interface';

@Controller()
export class AuthGrpcController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthService', 'Register')
  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const result = await this.authService.register({
        email: data.email,
        password: data.password,
        name: data.name,
      });
      return this.toGrpcAuthResponse(result);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Register failed';
      throw new RpcException({ code: status.ALREADY_EXISTS, message });
    }
  }

  @GrpcMethod('AuthService', 'Login')
  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const result = await this.authService.login(data.email, data.password);
      return this.toGrpcAuthResponse(result);
    } catch {
      throw new RpcException({
        code: status.UNAUTHENTICATED,
        message: 'Invalid email or password',
      });
    }
  }

  private toGrpcAuthResponse(result: {
    access_token: string;
    refresh_token: string;
    user: { id: string; email: string; name: string | null };
  }): AuthResponse {
    return {
      access_token: result.access_token,
      refresh_token: result.refresh_token,
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name ?? '',
      },
    };
  }

  @GrpcMethod('AuthService', 'Validate')
  async validate(data: ValidateRequest): Promise<ValidateResponse> {
    try {
      const user = await this.authService.validateToken(data.access_token);
      return {
        id: user.id,
        email: user.email,
        name: user.name ?? '',
      };
    } catch {
      throw new RpcException({
        code: status.UNAUTHENTICATED,
        message: 'Invalid or expired token',
      });
    }
  }
}
