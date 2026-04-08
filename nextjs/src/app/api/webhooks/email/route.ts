import { NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// Replicate logic to derive the initial status
function deriveStoredStatus(endDate?: string) {
    if (!endDate) return 'upcoming';
    const end = new Date(endDate);
    const now = new Date();
    if (end < now) return 'past';
    return 'upcoming';
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // 1. Verify Authentication
        if (body.secret !== process.env.EMAIL_WEBHOOK_SECRET) {
            console.error('Invalid webhooks secret');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 1.5 Verify Sender Email to block spam
        const allowedEmailsStr = process.env.ALLOWED_ADMIN_EMAILS;
        if (allowedEmailsStr && body.from) {
            const allowedEmails = allowedEmailsStr.split(',').map((e: string) => e.trim().toLowerCase());
            // body.from might be "John Doe <john@gmail.com>" or just "john@gmail.com"
            const senderEmailMatch = body.from.match(/<([^>]+)>/);
            const senderEmail = senderEmailMatch ? senderEmailMatch[1].toLowerCase() : body.from.trim().toLowerCase();

            if (!allowedEmails.includes(senderEmail)) {
                console.error(`Blocked email from unauthorized sender: ${senderEmail}`);
                return NextResponse.json({ error: 'Sender not authorized' }, { status: 403 });
            }
        }

        // 2. Parse Email with AI
        const emailContent = `
Subject: ${body.subject}
Body:
${body.body}
        `.trim();

        console.log('Extracting conference from email:', body.subject);

        const { object } = await generateObject({
            model: google('gemini-2.5-flash'), // Fast and precise for extraction
            schema: z.object({
                name: z.string().describe("The name of the conference (REQUIRED)"),
                organization: z.string().optional().describe("The name of the organization hosting it"),
                location: z.string().optional().describe("E.g., 'Jakarta, Indonesia' or 'Online'"),
                country_code: z.string().length(2).optional().describe("Two letter ISO country code, e.g. 'ID' for Indonesia"),
                start_date: z.string().optional().describe("ISO formatted YYYY-MM-DD"),
                end_date: z.string().optional().describe("ISO formatted YYYY-MM-DD"),
                description: z.string().optional().describe("A short summary or description of the conference"),
                website: z.string().optional().describe("The URL of the conference website"),
                price_per_delegate: z.string().optional().describe("Any pricing information mentioned"),
                registration_deadline: z.string().optional().describe("ISO formatted YYYY-MM-DD"),
            }),
            prompt: `You are an AI assistant processing an email forwarded by an admin. 
Extract the conference details from the following email content.
If any piece of information is missing, leave it undefined/null but do your best to infer it from the text.
If there are multiple dates, identify the start and end dates.

Email Content:
${emailContent}
`,
        });

        if (!object.name) {
            return NextResponse.json({ error: 'Could not extract conference name' }, { status: 400 });
        }

        // 3. Insert into Database
        const db = await getDb().connect();
        
        const status = deriveStoredStatus(object.end_date);

        try {
            await db.query('BEGIN');
            const result = await db.query(`
                INSERT INTO conferences (
                    name, organization, location, country_code, start_date, end_date, 
                    status, description, website, price_per_delegate, registration_deadline
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                RETURNING conference_id
            `, [
                object.name,
                object.organization || null,
                object.location || null,
                object.country_code || null,
                object.start_date || null,
                object.end_date || null,
                status,
                object.description || null,
                object.website || null,
                object.price_per_delegate || null,
                object.registration_deadline || null
            ]);

            await db.query('COMMIT');
            
            revalidatePath('/');
            revalidatePath('/admin');
            revalidatePath('/conferences');

            return NextResponse.json({ 
                success: true, 
                conferenceId: result.rows[0].conference_id,
                extracted: object 
            });

        } catch (error) {
            await db.query('ROLLBACK');
            throw error;
        } finally {
            db.release();
        }

    } catch (error: any) {
        console.error('Webhook processing error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
