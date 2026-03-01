import ContentPage from '@/components/ContentPage';

export default function PositionPapersPage() {
    return (
        <ContentPage title="📝 Position Papers">
            <p style={{ textAlign: 'center', marginBottom: '2rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                A position paper states your country's (or character's) position on the committee topic before the conference. Many conferences require or encourage them and some give a Best Position Paper award.
            </p>

            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '2rem', borderRadius: '16px', textAlign: 'left' }}>
                <h3 style={{ marginTop: 0, color: 'var(--text-primary)', fontFamily: "'Clash Display', sans-serif" }}>
                    📌 What to include
                </h3>
                <ul style={{ marginLeft: '1.5rem', marginBottom: '2rem' }}>
                    <li style={{ marginBottom: '0.75rem' }}><strong>Brief context</strong> — Why the topic matters to the international community.</li>
                    <li style={{ marginBottom: '0.75rem' }}><strong>Your country's position</strong> — Past actions, policies, and statements relevant to the topic.</li>
                    <li style={{ marginBottom: '0.75rem' }}><strong>Proposed solutions</strong> — Concrete recommendations your country supports.</li>
                    <li style={{ marginBottom: '0.75rem' }}>Use proper formatting (header with country, committee, topic; clear paragraphs or sections).</li>
                </ul>

                <p style={{ margin: 0, padding: '1rem', background: 'var(--bg-glass)', borderRadius: '8px', borderLeft: '4px solid var(--accent-blue)', color: 'var(--text-secondary)' }}>
                    Submit by the conference's deadline (see each conference's page for dates). Research your country's real policies and cite sources where required.
                </p>
            </div>
        </ContentPage>
    );
}
