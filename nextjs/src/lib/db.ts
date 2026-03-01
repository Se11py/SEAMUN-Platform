import { Pool } from '@neondatabase/serverless';

let pool: Pool | null = null;

export function getDb() {
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL environment variable is not set');
    }
    if (!pool) {
        pool = new Pool({ connectionString: process.env.DATABASE_URL });
    }
    return pool;
}
