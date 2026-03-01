import ContentPage from '@/components/ContentPage';
import Link from 'next/link';

export default function ExamplesPage() {
    return (
        <ContentPage title="💡 Examples">
            <p style={{ textAlign: 'center', marginBottom: '2rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                Short examples of MUN language and structure to help you prepare.
            </p>

            <div style={{ display: 'grid', gap: '2rem', textAlign: 'left' }}>
                <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1.5rem', borderRadius: '16px' }}>
                    <h3 style={{ marginTop: 0, color: 'var(--text-primary)', fontFamily: "'Clash Display', sans-serif" }}>
                        📜 Preambulatory phrases
                    </h3>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                        Noting with concern… / Recalling… / Acknowledging… / Reaffirming… / Guided by…
                    </p>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1.5rem', borderRadius: '16px' }}>
                    <h3 style={{ marginTop: 0, color: 'var(--text-primary)', fontFamily: "'Clash Display', sans-serif" }}>
                        ✍️ Operative phrases
                    </h3>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                        Calls upon… / Encourages… / Recommends… / Urges… / Declares… / Requests that…
                    </p>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1.5rem', borderRadius: '16px' }}>
                    <h3 style={{ marginTop: 0, color: 'var(--text-primary)', fontFamily: "'Clash Display', sans-serif" }}>
                        🎤 Opening a speech
                    </h3>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                        "Honorable Chair, fellow delegates. The delegation of [Country] believes that…"
                    </p>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1.5rem', borderRadius: '16px' }}>
                    <h3 style={{ marginTop: 0, color: 'var(--text-primary)', fontFamily: "'Clash Display', sans-serif" }}>
                        ✋ Point of Order
                    </h3>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                        "Point of Order. The delegate was not on the speakers' list."
                    </p>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1.5rem', borderRadius: '16px' }}>
                    <h3 style={{ marginTop: 0, color: 'var(--text-primary)', fontFamily: "'Clash Display', sans-serif" }}>
                        ⏱️ Yielding time
                    </h3>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                        "I yield my remaining time to the chair." / "I yield to questions."
                    </p>
                </div>
            </div>

            <p style={{ marginTop: '2rem', padding: '1rem', background: 'var(--bg-glass)', borderRadius: '8px', borderLeft: '4px solid var(--accent-blue)', color: 'var(--text-secondary)' }}>
                For full templates (e.g. resolution format), see <Link href="/templates">Templates</Link>. For procedure, see <Link href="/points">Points</Link>, <Link href="/motions">Motions</Link>, and <Link href="/resolutions">Resolutions</Link>.
            </p>
        </ContentPage>
    );
}
