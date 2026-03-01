import ContentPage from '@/components/ContentPage';
import Link from 'next/link';

export default function IndividualDelegatesPage() {
    return (
        <ContentPage title="👤 Individual Delegates">
            <p style={{ textAlign: 'center', marginBottom: '2rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                Some conferences allow delegates who are not part of a school delegation to register on their own.
            </p>

            <div style={{ display: 'grid', gap: '2rem', textAlign: 'left' }}>
                <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1.5rem', borderRadius: '16px' }}>
                    <h3 style={{ marginTop: 0, color: 'var(--text-primary)', fontFamily: "'Clash Display', sans-serif" }}>
                        🔍 How to find conferences
                    </h3>
                    <ul style={{ marginLeft: '1.5rem', marginBottom: 0 }}>
                        <li style={{ marginBottom: '0.5rem' }}>
                            On <Link href="/">Upcoming & Previous MUNs</Link>, open a conference. Look for "Independent delegates welcome" (or similar) and an <strong>individual / delegate signup link</strong>.
                        </li>
                        <li style={{ marginBottom: '0.5rem' }}>If that link is present, you can register yourself; otherwise, the conference may be school-only.</li>
                    </ul>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1.5rem', borderRadius: '16px' }}>
                    <h3 style={{ marginTop: 0, color: 'var(--text-primary)', fontFamily: "'Clash Display', sans-serif" }}>
                        ✅ What to do
                    </h3>
                    <ul style={{ marginLeft: '1.5rem', marginBottom: 0 }}>
                        <li style={{ marginBottom: '0.5rem' }}>Use the signup link to register, pay any delegate fee, and submit country/committee preferences and position papers by the deadline.</li>
                        <li style={{ marginBottom: '0.5rem' }}>
                            Arrive on time and follow the same conduct and procedure as school delegations (see <Link href="/conduct">Conduct & Decorum</Link> and resource pages).
                        </li>
                    </ul>
                </div>
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9em' }}>
                <p>Not all conferences accept independents; check each conference's page for details.</p>
            </div>
        </ContentPage>
    );
}
