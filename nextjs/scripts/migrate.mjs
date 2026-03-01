/**
 * Database Migration Runner
 *
 * Applies versioned SQL migrations in order, tracking which have been applied
 * in a _migrations table. Only runs migrations that haven't been applied yet.
 *
 * Usage:
 *   npx dotenv -e .env.local -- node scripts/migrate.mjs
 *
 * To create a new migration:
 *   1. Create a file in migrations/ with the next number (e.g., 002_add_column.sql)
 *   2. Write your SQL statements
 *   3. Run this script
 */

import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = path.join(__dirname, '..', 'migrations');

async function migrate() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        console.error('❌ DATABASE_URL not set. Run with: npx dotenv -e .env.local -- node scripts/migrate.mjs');
        process.exit(1);
    }

    const sql = neon(databaseUrl);

    // Ensure _migrations table exists
    await sql`
        CREATE TABLE IF NOT EXISTS _migrations (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
    `;

    // Get already-applied migrations
    const applied = await sql`SELECT name FROM _migrations ORDER BY name`;
    const appliedNames = new Set(applied.map(r => r.name));

    // Get all migration files, sorted
    const files = fs.readdirSync(MIGRATIONS_DIR)
        .filter(f => f.endsWith('.sql'))
        .sort();

    if (files.length === 0) {
        console.log('No migration files found in migrations/');
        return;
    }

    let appliedCount = 0;
    for (const file of files) {
        if (appliedNames.has(file)) {
            console.log(`⏭️  Already applied: ${file}`);
            continue;
        }

        console.log(`🔄 Applying: ${file}...`);
        const filePath = path.join(MIGRATIONS_DIR, file);
        const content = fs.readFileSync(filePath, 'utf8');

        // Split by semicolons but skip empty statements and comments-only blocks
        const statements = content
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.match(/^--.*$/m));

        try {
            for (const stmt of statements) {
                if (stmt.replace(/--.*$/gm, '').trim().length > 0) {
                    await sql(stmt);
                }
            }

            // Record successful migration
            await sql`INSERT INTO _migrations (name) VALUES (${file})`;
            console.log(`✅ Applied: ${file}`);
            appliedCount++;
        } catch (err) {
            console.error(`❌ Failed on: ${file}`);
            console.error(`   Error: ${err.message}`);
            process.exit(1);
        }
    }

    if (appliedCount === 0) {
        console.log('\n✅ Database is up to date — no new migrations to apply.');
    } else {
        console.log(`\n✅ Applied ${appliedCount} migration(s) successfully.`);
    }
}

migrate().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});
