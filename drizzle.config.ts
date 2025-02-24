import { defineConfig } from 'drizzle-kit'

export default defineConfig({
    schema: './database/schema/*',
    out: './database/migrations',
    dialect: 'turso',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
        authToken: process.env.DATABASE_AUTH_TOKEN!
    }
})