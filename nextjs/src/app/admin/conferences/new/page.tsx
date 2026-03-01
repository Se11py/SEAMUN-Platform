import ConferenceForm from '@/components/ConferenceForm';
import { createConference } from '@/lib/admin-actions';
import Link from 'next/link';

export default function NewConferencePage() {
    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <Link href="/admin" style={{ color: '#64748b', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className="fas fa-arrow-left"></i> Back to Dashboard
                </Link>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#0f172a', marginTop: '1rem' }}>
                    Add New Conference
                </h1>
            </div>

            <ConferenceForm action={createConference} />
        </div>
    );
}
