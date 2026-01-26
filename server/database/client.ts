import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres'
import pg from 'pg'

let db: NodePgDatabase | null = null

export function getDb(): NodePgDatabase {
  if (db) return db

  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error('Database is not configured. Please set DATABASE_URL environment variable.')
  }

  const pool = new pg.Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
  })
  
  db = drizzle(pool)

  return db
}