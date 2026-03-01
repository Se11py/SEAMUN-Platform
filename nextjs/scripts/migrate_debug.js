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
        console.log('Connected to database.');

        console.log('Reading schema file...');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Split by semicolon, but be careful about semicolons in strings if any (we don't have many)
        // Simple split by likely works for this schema file structure.
        const statements = schema
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        console.log(`Found ${statements.length} statements.`);

        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            console.log(`Executing statement ${i + 1}/${statements.length}: ${statement.substring(0, 50)}...`);
            try {
                await client.query(statement);
            } catch (err) {
                console.error(`❌ Error executing statement ${i + 1}:`);
                console.error(statement);
                console.error('Error details:', err);
                throw err;
            }
        }

        console.log('✅ Schema applied successfully!');
        await client.end();

    } catch (error) {
        console.error('❌ Migration failed.');
        await client.end();
        process.exit(1);
    }
}

main();
