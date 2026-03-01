import { getDb } from '@/lib/db';
import { notFound } from 'next/navigation';
import ConferenceForm from '@/components/ConferenceForm';
import { updateConference } from '@/lib/admin-actions';
import Link from 'next/link';

export default async function EditConferencePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const db = getDb();

    const result = await db.query('SELECT * FROM conferences WHERE conference_id = $1', [parseInt(id, 10)]);

    if (result.rows.length === 0) {
        notFound();
    }

    const conference = result.rows[0];
    const updateAction = updateConference.bind(null, parseInt(id, 10));

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <Link href="/admin" style={{ color: '#64748b', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className="fas fa-arrow-left"></i> Back to Dashboard
                </Link>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#0f172a', marginTop: '1rem' }}>
                    Edit Conference: {conference.name}
                </h1>
            </div>

            <ConferenceForm initialData={conference} action={updateAction} />
        </div>
    );
}
