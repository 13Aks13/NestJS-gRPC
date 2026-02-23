import { DataSource } from 'typeorm';
import { User } from '../user/entities/user.entity';

export const appDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'grpc_chat',
  entities: [User],
  synchronize: false,
});
