import ContentPage from '@/components/ContentPage';
import Link from 'next/link';

export default function AwardsPage() {
    return (
        <ContentPage title="🏆 Awards">
            <p style={{ textAlign: 'center', marginBottom: '2rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                Most MUN conferences give awards to recognize strong delegates. Exact names and categories vary by conference.
            </p>

            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '2rem', borderRadius: '16px', textAlign: 'left' }}>
                <h3 style={{ marginTop: 0, color: 'var(--text-primary)', fontFamily: "'Clash Display', sans-serif" }}>
                    🎖️ Common award types
                </h3>
                <ul style={{ marginLeft: '1.5rem', marginBottom: '2rem' }}>
                    <li style={{ marginBottom: '0.75rem' }}><strong>Best Delegate (BD)</strong> — Top performer in the committee.</li>
                    <li style={{ marginBottom: '0.75rem' }}><strong>Outstanding Delegate (OD)</strong> — Second-highest recognition.</li>
                    <li style={{ marginBottom: '0.75rem' }}><strong>Honorable Mention (HM)</strong> — Strong performance, often multiple per committee.</li>
                    <li style={{ marginBottom: '0.75rem' }}><strong>Best Position Paper</strong> — Best written submission before the conference.</li>
                    <li style={{ marginBottom: '0.75rem' }}><strong>Verbal Commendation</strong> — Recognition for speaking or diplomacy.</li>
                </ul>

                <p style={{ margin: 0, padding: '1rem', background: 'var(--bg-glass)', borderRadius: '8px', borderLeft: '4px solid var(--accent-blue)', color: 'var(--text-secondary)' }}>
                    Chairs and the secretariat decide awards based on participation, diplomacy, resolution-writing, and knowledge of the topic. Check each conference's page for their specific awards—see <Link href="/">Upcoming & Previous MUNs</Link> and open a conference for details.
                </p>
            </div>
        </ContentPage>
    );
}
