import { getDb } from '@/lib/db';
import { notFound } from 'next/navigation';
import ConferenceForm from '@/components/ConferenceForm';
import { updateConference } from '@/lib/admin-actions';
import Link from 'next/link';

export default async function EditConferencePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const conferenceId = parseInt(id, 10);
    const db = getDb();

    const [conferenceResult, committeesResult, uniqueTopicsResult, allocationsResult] = await Promise.all([
        db.query('SELECT * FROM conferences WHERE conference_id = $1', [conferenceId]),
        db.query('SELECT * FROM committees WHERE conference_id = $1 ORDER BY committee_id', [conferenceId]),
        db.query('SELECT topic FROM unique_topics WHERE conference_id = $1 ORDER BY topic_id', [conferenceId]),
        db.query('SELECT country FROM allocations WHERE conference_id = $1 ORDER BY allocation_id', [conferenceId]),
    ]);

    if (conferenceResult.rows.length === 0) {
        notFound();
    }

    const conference = conferenceResult.rows[0];
    const updateAction = updateConference.bind(null, conferenceId);
    const initialData = {
        ...conference,
        committees: committeesResult.rows,
        unique_topics: uniqueTopicsResult.rows.map((row: { topic: string }) => row.topic),
        allocations: allocationsResult.rows.map((row: { country: string }) => row.country),
    };

    return (
        <>
            <Link href="/admin" className="adm-back-link">
                <i className="fas fa-arrow-left"></i> Back to Dashboard
            </Link>
            <div className="adm-page-header" style={{ marginBottom: '1.5rem' }}>
                <h1>Edit: {conference.name}</h1>
            </div>
            <ConferenceForm initialData={initialData} action={updateAction} />
        </>
    );
}
