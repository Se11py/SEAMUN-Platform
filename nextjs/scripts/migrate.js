require('dotenv').config({ path: '.env.local' });
const { Client } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

async function main() {
    if (!process.env.DATABASE_URL) {
        console.error('Error: DATABASE_URL is not set in .env.local');
        process.exit(1);
    }

    const client = new Client(process.env.DATABASE_URL);
    const schemaPath = path.join(__dirname, '../src/lib/schema.sql');

    try {
        await client.connect();

        console.log('Reading schema file...');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        console.log('Executing schema migration...');
        await client.query(schema);

        console.log('✅ Schema applied successfully!');

        // simple test query
        const { rows } = await client.query('SELECT NOW()');
        console.log('Database connection verified. Server time:', rows[0].now);

        await client.end();

    } catch (error) {
        console.error('❌ Error applying schema:', error);
        await client.end();
        process.exit(1);
    }
}

main();
