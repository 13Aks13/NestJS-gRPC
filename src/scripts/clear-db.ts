import 'dotenv/config';
import { appDataSource } from './data-source';
import { User } from '../user/entities/user.entity';

async function clearDb() {
  await appDataSource.initialize();
  try {
    const repo = appDataSource.getRepository(User);
    const result = await repo.delete({});
    console.log(`Cleared ${result.affected ?? 0} user(s) from the database.`);
  } finally {
    await appDataSource.destroy();
  }
}

clearDb().catch((err) => {
  console.error(err);
  process.exit(1);
});
