
import { type NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { checkRateLimit } from '@/lib/rate-limit';
import { getConferenceStatus } from '@/lib/conferences-data';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const isAllowed = await checkRateLimit(request, 100);
        if (!isAllowed) {
            return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
        }
        const { id } = await params;
        const db = getDb();

        // Fetch conference
        const result = await db.query('SELECT * FROM conferences WHERE conference_id = $1', [id]);

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Conference not found' }, { status: 404 });
        }

        const conference = result.rows[0];

        // Fetch related data in parallel
        const [committeesRes, allocationsRes, uniqueTopicsRes, availableAwardsRes] = await Promise.all([
            db.query('SELECT * FROM committees WHERE conference_id = $1', [id]),
            db.query('SELECT country FROM allocations WHERE conference_id = $1', [id]),
            db.query('SELECT topic FROM unique_topics WHERE conference_id = $1', [id]),
            db.query('SELECT award_name FROM available_awards WHERE conference_id = $1', [id])
        ]);

        conference.committees = committeesRes.rows;
        conference.allocations = allocationsRes.rows.map((row: any) => row.country);
        conference.uniqueTopics = uniqueTopicsRes.rows.map((row: any) => row.topic);
        conference.availableAwards = availableAwardsRes.rows.map((row: any) => row.award_name);
        conference.status = getConferenceStatus({
            endDate: conference.end_date,
            status: conference.status,
        });

        return NextResponse.json(conference);

    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch conference details', details: String(error) },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const isAllowed = await checkRateLimit(request, 30); // 30 updates per minute
        if (!isAllowed) {
            return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
        }
        const { id } = await params;
        const data = await request.json();
        const db = getDb();

        await db.query(`
      UPDATE conferences SET
        name = $1, organization = $2, location = $3, country_code = $4,
        start_date = $5, end_date = $6, description = $7, website = $8,
        registration_deadline = $9, position_paper_deadline = $10, status = $11,
        size = $12, general_email = $13, updated_at = NOW()
      WHERE conference_id = $14
    `, [
            data.name, data.organization, data.location, data.countryCode,
            data.startDate, data.endDate, data.description, data.website,
            data.registrationDeadline, data.positionPaperDeadline, data.status,
            data.size, data.generalEmail, id
        ]);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            { error: 'Failed to update conference', details: String(error) },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const isAllowed = await checkRateLimit(request, 10); // 10 deletes per minute
        if (!isAllowed) {
            return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
        }
        const { id } = await params;
        const db = getDb();

        await db.query('DELETE FROM conferences WHERE conference_id = $1', [id]);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            { error: 'Failed to delete conference', details: String(error) },
            { status: 500 }
        );
    }
}
