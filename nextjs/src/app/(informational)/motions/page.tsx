import ContentPage from '@/components/ContentPage';
import Link from 'next/link';

export default function MotionsPage() {
    return (
        <ContentPage title="📋 Motions">
            <Link href="/munsimulation" target="_blank" rel="noopener noreferrer" className="mun-simulation-ad" style={{ display: 'block', textDecoration: 'none', marginBottom: '24px', padding: '24px 28px', background: 'linear-gradient(135deg, rgba(43, 95, 166, 0.95) 0%, rgba(107, 76, 154, 0.95) 100%)', color: '#fff', borderRadius: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                    <div style={{ flexShrink: 0, width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fas fa-gamepad" style={{ fontSize: '28px' }}></i>
                    </div>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <strong style={{ display: 'block', fontSize: '1.1rem', marginBottom: '4px', fontWeight: 600 }}>MUN Procedure Simulation</strong>
                        <span style={{ opacity: 0.95, fontSize: '0.95rem', lineHeight: '1.5' }}>Single-player game to practice MUN procedure at your own pace — try it at munsimulation</span>
                    </div>
                    <span style={{ flexShrink: 0, padding: '10px 20px', background: 'rgba(255,255,255,0.25)', borderRadius: '10px', fontWeight: 600, fontSize: '0.9rem' }}>Play now →</span>
                </div>
            </Link>

            <p style={{ textAlign: 'center', marginBottom: '2rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                Motions are proposals to change what the committee is doing. They require a second, and often a vote. Standard motions include:
            </p>

            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '2rem', borderRadius: '16px', textAlign: 'left' }}>
                <ul style={{ marginLeft: '1.5rem', marginBottom: '2rem' }}>
                    <li style={{ marginBottom: '0.75rem' }}><strong>Motion to open debate</strong> — Begin debate on the topic or agenda.</li>
                    <li style={{ marginBottom: '0.75rem' }}><strong>Motion to set the agenda</strong> — Choose the order of topics when multiple topics are on the floor.</li>
                    <li style={{ marginBottom: '0.75rem' }}><strong>Motion for a moderated caucus</strong> — Timed debate with a speaking time; chair calls on speakers.</li>
                    <li style={{ marginBottom: '0.75rem' }}><strong>Motion for an unmoderated caucus</strong> — Informal time to talk and form blocs (no formal speakers' list).</li>
                    <li style={{ marginBottom: '0.75rem' }}><strong>Motion to introduce a draft resolution</strong> — Bring a resolution to the floor for debate.</li>
                    <li style={{ marginBottom: '0.75rem' }}><strong>Motion to move to voting procedure</strong> — End debate and vote on the resolution.</li>
                    <li style={{ marginBottom: '0.75rem' }}><strong>Motion to table</strong> — Postpone discussion of the current matter.</li>
                    <li style={{ marginBottom: '0.75rem' }}><strong>Motion to adjourn</strong> — End the session.</li>
                </ul>

                <p style={{ margin: 0, padding: '1rem', background: 'var(--bg-glass)', borderRadius: '8px', borderLeft: '4px solid var(--accent-blue)', color: 'var(--text-secondary)' }}>
                    Motions usually need to be in order (e.g. no voting motion while no resolution is on the floor). Chairs rule on order and precedence; check your conference's rules.
                </p>
            </div>
        </ContentPage>
    );
}
