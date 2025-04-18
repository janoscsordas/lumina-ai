import { drizzle } from 'drizzle-orm/libsql';
import * as userSchema from './schema/auth-schema';
import * as chatSchema from './schema/chat-schema';

export const db = drizzle({ connection: {
  url: process.env.DATABASE_URL!, 
  authToken: process.env.DATABASE_AUTH_TOKEN!
},
  schema: {
    ...userSchema,
    ...chatSchema
  }
});