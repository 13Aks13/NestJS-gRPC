import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';

export interface JwtPayload {
  sub: string;
  email: string;
}

export interface AuthResult {
  access_token: string;
  user: { id: string; email: string; name: string | null };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResult> {
    const user = await this.userService.create({
      email: dto.email,
      password: dto.password,
      name: dto.name,
    });
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    } as JwtPayload);
    return {
      access_token: token,
      user: { id: user.id, email: user.email, name: user.name },
    };
  }

  async login(email: string, password: string): Promise<AuthResult> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    } as JwtPayload);
    return {
      access_token: token,
      user: { id: user.id, email: user.email, name: user.name },
    };
  }

  async validateUser(
    payload: JwtPayload,
  ): Promise<{ id: string; email: string; name: string | null } | null> {
    return this.userService.findById(payload.sub);
  }

  async validateToken(accessToken: string): Promise<{
    id: string;
    email: string;
    name: string | null;
  }> {
    try {
      const payload = this.jwtService.verify<JwtPayload>(accessToken);
      const user = await this.userService.findById(payload.sub);
      if (!user) throw new Error('User not found');
      return { id: user.id, email: user.email, name: user.name };
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
