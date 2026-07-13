import { db } from './index.ts';
import { users } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string) {
  const isAdmin = email === 'booodyb9@gmail.com';
  
  const result = await db.insert(users)
    .values({
      uid,
      email,
      isAdmin,
    })
    .onConflictDoUpdate({
      target: users.uid,
      set: {
        email,
        isAdmin,
      },
    })
    .returning();

  return result[0];
}
