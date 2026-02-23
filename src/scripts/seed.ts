import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { appDataSource } from './data-source';
import { User } from '../user/entities/user.entity';

const SEED_COUNT = 20;
const DEFAULT_PASSWORD = 'password123';

async function seed() {
  await appDataSource.initialize();
  try {
    await appDataSource.synchronize();
    const repo = appDataSource.getRepository(User);
    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

    for (let i = 1; i <= SEED_COUNT; i++) {
      const user = repo.create({
        email: `user${i}@example.com`,
        passwordHash,
        name: `User ${i}`,
      });
      await repo.save(user);
    }

    console.log(
      `Seeded ${SEED_COUNT} users. Email: user1@example.com … user${SEED_COUNT}@example.com, password: ${DEFAULT_PASSWORD}`,
    );
  } finally {
    await appDataSource.destroy();
  }
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
