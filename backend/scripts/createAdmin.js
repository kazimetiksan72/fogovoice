import { connectDb } from '../src/config/db.js';
import { createAdminUser } from '../src/services/authService.js';

const [name, email, password] = process.argv.slice(2);

if (!name || !email || !password) {
  console.error('Usage: npm run seed:admin -- "Admin Name" admin@example.com password123');
  process.exit(1);
}

try {
  await connectDb();
  const user = await createAdminUser({ name, email, password });
  console.log(`Admin created: ${user.email}`);
  process.exit(0);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
