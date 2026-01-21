import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

let db: PostgresJsDatabase | null = null

export function getDb(): PostgresJsDatabase {
  if (db) return db

  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error('Database is not configured. Please set DATABASE_URL environment variable.')
  }

  const client = postgres(connectionString)
  db = drizzle(client)

  return db
}
