import ContentPage from '@/components/ContentPage';
import Link from 'next/link';

export default function ResolutionsPage() {
    return (
        <ContentPage title="📄 Resolutions">
            <p style={{ textAlign: 'center', marginBottom: '2rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                Resolutions are the main outcome of most MUN committees: a formal document that states the committee's decisions and recommendations.
            </p>

            <div style={{ display: 'grid', gap: '2rem', textAlign: 'left' }}>
                <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1.5rem', borderRadius: '16px' }}>
                    <h3 style={{ marginTop: 0, color: 'var(--text-primary)', fontFamily: "'Clash Display', sans-serif" }}>
                        📐 Structure
                    </h3>
                    <ul style={{ marginLeft: '1.5rem', marginBottom: 0 }}>
                        <li style={{ marginBottom: '0.5rem' }}><strong>Preambulatory clauses</strong> — "Noting," "Acknowledging," "Recalling" past actions and context. No actionable language.</li>
                        <li style={{ marginBottom: '0.5rem' }}><strong>Operative clauses</strong> — "Calls upon," "Encourages," "Recommends" specific actions. Numbered; can have sub-clauses.</li>
                    </ul>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1.5rem', borderRadius: '16px' }}>
                    <h3 style={{ marginTop: 0, color: 'var(--text-primary)', fontFamily: "'Clash Display', sans-serif" }}>
                        🔄 Process
                    </h3>
                    <ul style={{ marginLeft: '1.5rem', marginBottom: 0 }}>
                        <li style={{ marginBottom: '0.5rem' }}>Draft resolutions are written (often in blocs) during unmoderated caucus.</li>
                        <li style={{ marginBottom: '0.5rem' }}>They need a minimum number of signatories and/or sponsors, set by the conference.</li>
                        <li style={{ marginBottom: '0.5rem' }}>Once introduced, the committee debates and can amend (friendly or unfriendly amendments).</li>
                        <li style={{ marginBottom: '0.5rem' }}>Voting: amendments first, then the resolution as a whole. Majority usually required to pass.</li>
                    </ul>
                </div>
            </div>

            <p style={{ marginTop: '2rem', padding: '1rem', background: 'var(--bg-glass)', borderRadius: '8px', borderLeft: '4px solid var(--accent-blue)', color: 'var(--text-secondary)' }}>
                Use the correct phrasing and follow your conference's format. See <Link href="/templates">Templates</Link> for examples if available.
            </p>
        </ContentPage>
    );
}
