import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

export interface CreateUserDto {
  email: string;
  password: string;
  name?: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<Omit<User, 'passwordHash'>> {
    const existing = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.userRepository.create({
      email: dto.email,
      passwordHash,
      name: dto.name ?? null,
    });
    const saved = await this.userRepository.save(user);
    return this.toPublic(saved);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<Omit<User, 'passwordHash'> | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    return user ? this.toPublic(user) : null;
  }

  async findAll(): Promise<Omit<User, 'passwordHash'>[]> {
    const users = await this.userRepository.find({
      order: { createdAt: 'DESC' },
    });
    return users.map((u) => this.toPublic(u));
  }

  toPublicUser(user: User): Omit<User, 'passwordHash'> {
    const { id, email, name, createdAt, updatedAt } = user;
    return { id, email, name, createdAt, updatedAt };
  }

  private toPublic(user: User): Omit<User, 'passwordHash'> {
    return this.toPublicUser(user);
  }
}
