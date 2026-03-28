
import { type NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { checkRateLimit } from '@/lib/rate-limit';
import { withDerivedConferenceStatus } from '@/lib/conferences-data';

export async function GET(request: NextRequest) {
    try {
        const isAllowed = await checkRateLimit(request, 100); // 100 requests per minute
        if (!isAllowed) {
            return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
        }
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const search = searchParams.get('search');

        const db = getDb();
        let query = 'SELECT * FROM conferences WHERE 1=1';
        const params: any[] = [];

        if (status) {
            params.push(status);
            query += ` AND status = $${params.length}`;
        }

        if (search) {
            const searchTerm = `%${search}%`;
            params.push(searchTerm);
            const idx = params.length;
            query += ` AND (name ILIKE $${idx} OR location ILIKE $${idx} OR organization ILIKE $${idx})`;
        }

        query += ' ORDER BY start_date DESC';

        const result = await db.query(query, params);

        const mappedRows = result.rows.map(row => withDerivedConferenceStatus({
            id: row.conference_id,
            name: row.name,
            organization: row.organization,
            location: row.location,
            countryCode: row.country_code,
            startDate: row.start_date,
            endDate: row.end_date,
            description: row.description,
            website: row.website,
            registrationDeadline: row.registration_deadline,
            positionPaperDeadline: row.position_paper_deadline,
            status: row.status,
            size: row.size,
            generalEmail: row.general_email,
            munAccount: row.mun_account,
            advisorAccount: row.advisor_account,
            secGenAccounts: row.sec_gen_accounts,
            parliamentarianAccounts: row.parliamentarian_accounts,
            pricePerDelegate: row.price_per_delegate,
            independentDelsWelcome: row.independent_dels_welcome,
            independentSignupLink: row.independent_signup_link,
            advisorSignupLink: row.advisor_signup_link,
            disabledSuitable: row.disabled_suitable,
            sensorySuitable: row.sensory_suitable,
            schedule: row.schedule,
            venueGuide: row.venue_guide,
            extraNotes: row.extra_notes,
        }));

        return NextResponse.json(mappedRows);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch conferences', details: String(error) },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const isAllowed = await checkRateLimit(request, 20); // 20 creates per minute
        if (!isAllowed) {
            return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
        }
        const data = await request.json();
        const db = getDb();

        const result = await db.query(`
      INSERT INTO conferences (
        name, organization, location, country_code, start_date, end_date,
        description, website, registration_deadline, position_paper_deadline,
        status, size, general_email, mun_account, advisor_account,
        sec_gen_accounts, parliamentarian_accounts, price_per_delegate,
        independent_dels_welcome, independent_signup_link, advisor_signup_link,
        disabled_suitable, sensory_suitable, schedule, venue_guide, extra_notes
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 
        $11, $12, $13, $14, $15, $16, $17, $18, 
        $19, $20, $21, $22, $23, $24, $25, $26
      )
      RETURNING conference_id
    `, [
            data.name, data.organization, data.location, data.countryCode,
            data.startDate, data.endDate, data.description, data.website,
            data.registrationDeadline, data.positionPaperDeadline,
            data.status || 'upcoming', data.size, data.generalEmail,
            data.munAccount, data.advisorAccount, data.secGenAccounts,
            data.parliamentarianAccounts, data.pricePerDelegate,
            data.independentDelsWelcome ?? false, data.independentSignupLink,
            data.advisorSignupLink, data.disabledSuitable ?? false,
            data.sensorySuitable ?? false, data.schedule, data.venueGuide,
            data.extraNotes
        ]);

        const conferenceId = result.rows[0].conference_id;

        if (data.committees && Array.isArray(data.committees)) {
            for (const committee of data.committees) {
                await db.query(`
           INSERT INTO committees (conference_id, name, topic, chair_info)
           VALUES ($1, $2, $3, $4)
         `, [conferenceId, committee.name, committee.topic, committee.chairInfo]);
            }
        }

        return NextResponse.json({ success: true, conference_id: conferenceId }, { status: 201 });

    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            { error: 'Failed to create conference', details: String(error) },
            { status: 500 }
        );
    }
}
