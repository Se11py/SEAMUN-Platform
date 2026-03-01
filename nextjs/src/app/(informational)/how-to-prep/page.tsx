import ContentPage from '@/components/ContentPage';
import Link from 'next/link';

export default function HowToPrepPage() {
    return (
        <ContentPage title="📋 How to Prep for MUN">
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

            <div className="info-card" style={{ marginTop: '24px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <i className="fas fa-link" style={{ color: 'var(--accent-green)' }}></i>
                    Practice Resources
                </h3>
                <div style={{ background: 'var(--bg-glass)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <Link href="/munsimulation" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--accent-blue)', textDecoration: 'none', padding: '8px 12px', background: 'rgba(74, 144, 226, 0.1)', borderRadius: '6px', fontSize: '0.9em' }}>
                        <i className="fas fa-gamepad"></i>
                        MUN Simulation Game
                    </Link>
                </div>
            </div>
        </ContentPage>
    );
}
