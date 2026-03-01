import ContentPage from '@/components/ContentPage';

export default function CrisisPage() {
    return (
        <ContentPage title="⚡ Crisis">
            <p style={{ textAlign: 'center', marginBottom: '2rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                Crisis committees simulate fast-moving scenarios (historical, fictional, or hybrid). Delegates play specific characters or countries and respond to crisis updates from the dais.
            </p>

            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '2rem', borderRadius: '16px', textAlign: 'left' }}>
                <h3 style={{ marginTop: 0, color: 'var(--text-primary)', fontFamily: "'Clash Display', sans-serif" }}>
                    🔄 How it works
                </h3>
                <ul style={{ marginLeft: '1.5rem', marginBottom: '2rem' }}>
                    <li style={{ marginBottom: '0.75rem' }}><strong>Backroom</strong> — A crisis staff updates the scenario based on delegates' actions and injects new events.</li>
                    <li style={{ marginBottom: '0.75rem' }}><strong>Directives</strong> — Delegates write short directives (alone or in blocs) to take action; the crisis team responds with outcomes.</li>
                    <li style={{ marginBottom: '0.75rem' }}><strong>Speeches & caucuses</strong> — Shorter speaking times and more unmoderated time; procedure is faster than in GA-style committees.</li>
                    <li style={{ marginBottom: '0.75rem' }}><strong>Surprises</strong> — Crisis updates can change the scenario; delegates must adapt and stay in character.</li>
                </ul>

                <p style={{ margin: 0, padding: '1rem', background: 'var(--bg-glass)', borderRadius: '8px', borderLeft: '4px solid var(--accent-blue)', color: 'var(--text-secondary)' }}>
                    Good crisis delegates stay in character, write clear and impactful directives, and collaborate when it helps their goals. Check each conference's committee list for crisis committees and their topics.
                </p>
            </div>
        </ContentPage>
    );
}
