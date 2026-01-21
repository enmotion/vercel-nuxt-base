import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './server/modules/*/*.schema.ts',
  out: './server/database/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
})
