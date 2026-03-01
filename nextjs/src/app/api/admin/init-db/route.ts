
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { MUN_CONFERENCES_DATA } from '@/lib/conferences-data';
import fs from 'fs';
import path from 'path';


export async function POST() {
    try {
        // Simple protection: Check for a secret header or just allow for now in dev
        // In production, you'd want valid authentication here.

        const db = getDb();

        // 1. Read Schema
        const schemaPath = path.join(process.cwd(), 'src', 'lib', 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        // 2. Execute Schema
        // Remove comments
        const cleanSql = schemaSql.replace(/--.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');

        // Split by semicolon using a lookbehind/lookahead or just simple split
        // Simple split by ; is usually okay if no ; inside strings. 
        // Schema uses simple SQL, standard ; delimiters.
        const statements = cleanSql.split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        const executed = [];
        for (const statement of statements) {
            try {
                await db.query(statement);
                executed.push(statement.substring(0, 30) + '...');
            } catch (e) {
                console.warn("Schema statement failed:", statement.substring(0, 50), e);
                // If DROP fails, it might be fine. If CREATE fails, we have problem.
            }
        }

        // 3. Seed Data
        let count = 0;
        for (const data of MUN_CONFERENCES_DATA) {
            // Map JS camelCase to DB snake_case for manual insert
            // Or reuse the logic we had. Let's keep it simple and explicit.

            // Handle dates: YYYY-MM-DD
            const startDate = data.startDate || null;
            const endDate = data.endDate || null;
            const regDeadline = data.registrationDeadline || null;
            const ppDeadline = data.positionPaperDeadline || null;

            await db.query(`
            INSERT INTO conferences (
                conference_id, name, organization, location, country_code, start_date, end_date,
                description, website, registration_deadline, position_paper_deadline,
                status, size, general_email, mun_account, advisor_account,
                sec_gen_accounts, parliamentarian_accounts, price_per_delegate,
                independent_dels_welcome, independent_signup_link, advisor_signup_link,
                disabled_suitable, sensory_suitable, schedule, venue_guide, extra_notes
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
                $11, $12, $13, $14, $15,
                $16, $17, $18, $19, $20, $21,
                $22, $23, $24, $25, $26, $27
            )
            ON CONFLICT (conference_id) DO UPDATE SET
                status = $12,
                updated_at = NOW()
        `, [
                data.id, data.name, data.organization, data.location, data.countryCode,
                startDate, endDate, data.description, data.website,
                regDeadline, ppDeadline,
                data.status, data.size, data.generalEmail, data.munAccount, data.advisorAccount,
                data.secGenAccounts, data.parliamentarianAccounts, data.pricePerDelegate,
                data.independentDelsWelcome || false, data.independentSignupLink, data.advisorSignupLink,
                data.disabledSuitable || false, data.sensorySuitable || false, data.schedule, data.venueGuide, data.extraNotes
            ]);

            // Insert committees
            if (data.committees && Array.isArray(data.committees)) {
                for (const committeeStr of data.committees) {
                    // The data uses formatted strings: "ABBREV - Full Name | Chair info"
                    // We need to parse this if we want rich data, OR just insert as name?
                    // The schema has: name, topic, chair_info.
                    // Use regex to parse: "ABBREV - Name | Chair: ..."

                    // Simple parser from string structure seen in data
                    // Advanced parser for "Name - Topic | Topic 2 | Chair" structure
                    const parts = committeeStr.split('|').map(p => p.trim());

                    const firstPart = parts[0] || '';
                    let name = firstPart;
                    let topic = '';
                    let chairInfo = '';

                    const dashIndex = firstPart.indexOf(' - ');
                    if (dashIndex > -1) {
                        name = firstPart.substring(0, dashIndex).trim();
                        topic = firstPart.substring(dashIndex + 3).trim();
                    } else {
                        name = firstPart;
                    }

                    // Process remaining parts (Topic 2, Chairs, etc.)
                    for (let i = 1; i < parts.length; i++) {
                        const part = parts[i];
                        if (!part) continue;
                        if (part.match(/^Topic/i)) {
                            topic += (topic ? ' | ' : '') + part;
                        } else if (part) {
                            chairInfo += (chairInfo ? ' | ' : '') + part;
                        }
                    }

                    await db.query(`
                        INSERT INTO committees (conference_id, name, topic, chair_info)
                        VALUES ($1, $2, $3, $4)
                    `, [data.id, name, topic, chairInfo]);
                }

                // Also Allocations, Unique Topics, Awards?
                // MUN_CONFERENCES_DATA has string arrays for these.
                // Schema has tables for them.

                if (data.allocations) {
                    for (const country of data.allocations) {
                        await db.query(`INSERT INTO allocations (conference_id, country) VALUES ($1, $2)`, [data.id, country]);
                    }
                }

                if (data.uniqueTopics) {
                    for (const topic of data.uniqueTopics) {
                        await db.query(`INSERT INTO unique_topics (conference_id, topic) VALUES ($1, $2)`, [data.id, topic]);
                    }
                }

                if (data.availableAwards) {
                    for (const award of data.availableAwards) {
                        await db.query(`INSERT INTO available_awards (conference_id, award_name) VALUES ($1, $2)`, [data.id, award]);
                    }
                }
            }
            count++;
        }

        return NextResponse.json({ success: true, seeded: count, executed_statements: executed });

    } catch (error) {
        console.error('Init DB error:', error);
        return NextResponse.json(
            { error: 'Failed to initialize database', details: String(error) },
            { status: 500 }
        );
    }
}
