import ContentPage from '@/components/ContentPage';
import Link from 'next/link';

export default function TemplatesPage() {
    return (
        <ContentPage title="📥 Templates">
            <p style={{ textAlign: 'center', marginBottom: '2rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                Use these as a starting point; always follow your conference's required format.
            </p>

            <div style={{ display: 'grid', gap: '2rem', textAlign: 'left' }}>
                <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1.5rem', borderRadius: '16px' }}>
                    <h3 style={{ marginTop: 0, color: 'var(--text-primary)', fontFamily: "'Clash Display', sans-serif" }}>
                        📝 Position paper (short form)
                    </h3>
                    <pre style={{ background: 'var(--bg-glass,#f5f5f5)', padding: '1rem', borderRadius: '8px', overflowX: 'auto', fontSize: '0.9em', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                        Country: [Full country name]{'\n'}
                        Committee: [Committee name]{'\n'}
                        Topic: [Topic name]{'\n'}
                        {'\n'}
                        [Paragraph 1: Background and importance of the topic]{'\n'}
                        [Paragraph 2: Your country's position and past actions]{'\n'}
                        [Paragraph 3: Proposed solutions and recommendations]
                    </pre>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1.5rem', borderRadius: '16px' }}>
                    <h3 style={{ marginTop: 0, color: 'var(--text-primary)', fontFamily: "'Clash Display', sans-serif" }}>
                        📄 Resolution header
                    </h3>
                    <pre style={{ background: 'var(--bg-glass,#f5f5f5)', padding: '1rem', borderRadius: '8px', overflowX: 'auto', fontSize: '0.9em', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                        Committee: [Name]{'\n'}
                        Topic: [Topic]{'\n'}
                        Sponsors: [Country 1], [Country 2], ...{'\n'}
                        Signatories: [Country A], [Country B], ...{'\n'}
                        {'\n'}
                        The [Committee], ...
                    </pre>
                </div>
            </div>

            <p style={{ marginTop: '2rem', padding: '1rem', background: 'var(--bg-glass)', borderRadius: '8px', borderLeft: '4px solid var(--accent-blue)', color: 'var(--text-secondary)' }}>
                Preambulatory clauses use past tense (Noting, Recalling). Operative clauses use present (Calls upon, Encourages). See <Link href="/resolutions">Resolutions</Link> and <Link href="/examples">Examples</Link> for phrasing.
            </p>
        </ContentPage>
    );
}
