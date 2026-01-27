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
  
  // 监听连接事件，仅用于首次验证
  pool.on('error', (err) => {
    console.error('❌ Database connection error:', err)
  })

  pool.connect().then((client) => {
    console.log('✅ Database connected successfully!')
    client.release()
  }).catch((err) => {
    console.error('❌ Failed to connect to database:', err)
  })
  
  db = drizzle(pool)

  return db
}