import ConferenceForm from '@/components/ConferenceForm';
import { createConference } from '@/lib/admin-actions';
import Link from 'next/link';

export default function NewConferencePage() {
    return (
        <>
            <Link href="/admin" className="adm-back-link">
                <i className="fas fa-arrow-left"></i> Back to Dashboard
            </Link>
            <div className="adm-page-header" style={{ marginBottom: '1.5rem' }}>
                <h1>New Conference</h1>
            </div>
            <ConferenceForm action={createConference} />
        </>
    );
}
