import ContentPage from '@/components/ContentPage';

export default function ChairSuperlativesPage() {
    return (
        <ContentPage title="🏅 Chair Superlatives">
            <p className="section-intro" style={{ textAlign: 'center', marginBottom: '2rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                A fun, chair-friendly superlative list for end-of-committee reflections, awards, or shout-outs. Use as-is or customize to fit your committee's vibe.
            </p>

            <div style={{ display: 'grid', gap: '2rem', textAlign: 'left' }}>
                <div className="info-card" style={{ background: 'rgba(255,255,255,0.6)', padding: '1.5rem', borderRadius: '16px' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--text-primary)', fontFamily: "'Clash Display', sans-serif" }}>
                        <i className="fas fa-star" style={{ color: 'var(--accent-blue)' }}></i>
                        Who's most likely to
                    </h3>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-secondary)', lineHeight: '1.6', columns: 2, columnGap: '32px' }}>
                        <li style={{ marginBottom: '0.25rem' }}>Start a war</li>
                        <li style={{ marginBottom: '0.25rem' }}>Build a school</li>
                        <li style={{ marginBottom: '0.25rem' }}>Build a hospital</li>
                        <li style={{ marginBottom: '0.25rem' }}>Become an advocate</li>
                        <li style={{ marginBottom: '0.25rem' }}>Become a lawyer</li>
                        <li style={{ marginBottom: '0.25rem' }}>Become a president</li>
                        <li style={{ marginBottom: '0.25rem' }}>Become a doctor</li>
                        <li style={{ marginBottom: '0.25rem' }}>Become a motivational speaker</li>
                        <li style={{ marginBottom: '0.25rem' }}>Break the geneva convention during MUN</li>
                        <li style={{ marginBottom: '0.25rem' }}>Become a UN member</li>
                        <li style={{ marginBottom: '0.25rem' }}>Instigate massive societal reform</li>
                        <li style={{ marginBottom: '0.25rem' }}>Manipulate delegates to achieve a personal goal</li>
                        <li style={{ marginBottom: '0.25rem' }}>Motion for a moderated caucus</li>
                        <li style={{ marginBottom: '0.25rem' }}>Motion for an unmoderated caucus</li>
                        <li style={{ marginBottom: '0.25rem' }}>Motion for a consultation of a whole</li>
                        <li style={{ marginBottom: '0.25rem' }}>Motion for extended speaking times</li>
                        <li style={{ marginBottom: '0.25rem' }}>Miss role call</li>
                        <li style={{ marginBottom: '0.25rem' }}>Raise a point of personal privilege to use the bathroom</li>
                        <li style={{ marginBottom: '0.25rem' }}>Make a move on an MUN crush</li>
                        <li style={{ marginBottom: '0.25rem' }}>Cure cancer</li>
                        <li style={{ marginBottom: '0.25rem' }}>Use personal pronouns during a speech</li>
                        <li style={{ marginBottom: '0.25rem' }}>Offend someone unintentionally</li>
                        <li style={{ marginBottom: '0.25rem' }}>Offend someone intentionally</li>
                        <li style={{ marginBottom: '0.25rem' }}>Become everyone's new best friend</li>
                        <li style={{ marginBottom: '0.25rem' }}>Get into an argument with someone</li>
                    </ul>
                </div>

                <div className="info-card" style={{ background: 'rgba(255,255,255,0.6)', padding: '1.5rem', borderRadius: '16px' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--text-primary)', fontFamily: "'Clash Display', sans-serif" }}>
                        <i className="fas fa-trophy" style={{ color: 'var(--accent-yellow)' }}></i>
                        Who should get
                    </h3>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        <li style={{ marginBottom: '0.25rem' }}>Best Delegate</li>
                        <li style={{ marginBottom: '0.25rem' }}>Honorable Delegate Mention (x2)</li>
                    </ul>
                </div>

                <div className="info-card" style={{ background: 'rgba(255,255,255,0.6)', padding: '1.5rem', borderRadius: '16px' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--text-primary)', fontFamily: "'Clash Display', sans-serif" }}>
                        <i className="fas fa-microphone" style={{ color: 'var(--accent-green)' }}></i>
                        Who had the
                    </h3>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-secondary)', lineHeight: '1.6', columns: 2, columnGap: '32px' }}>
                        <li style={{ marginBottom: '0.25rem' }}>Best speeches</li>
                        <li style={{ marginBottom: '0.25rem' }}>Best POIs and POCs</li>
                        <li style={{ marginBottom: '0.25rem' }}>Best resolution</li>
                        <li style={{ marginBottom: '0.25rem' }}>Best stance</li>
                        <li style={{ marginBottom: '0.25rem' }}>Best smile</li>
                        <li style={{ marginBottom: '0.25rem' }}>Clearest voice</li>
                    </ul>
                </div>

                <div className="info-card" style={{ background: 'rgba(255,255,255,0.6)', padding: '1.5rem', borderRadius: '16px' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--text-primary)', fontFamily: "'Clash Display', sans-serif" }}>
                        <i className="fas fa-user-friends" style={{ color: 'var(--accent-purple)' }}></i>
                        Who was the
                    </h3>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-secondary)', lineHeight: '1.6', columns: 2, columnGap: '32px' }}>
                        <li style={{ marginBottom: '0.25rem' }}>Best dressed</li>
                        <li style={{ marginBottom: '0.25rem' }}>Most diplomatic</li>
                        <li style={{ marginBottom: '0.25rem' }}>Quietest</li>
                        <li style={{ marginBottom: '0.25rem' }}>Loudest</li>
                        <li style={{ marginBottom: '0.25rem' }}>Friendliest</li>
                        <li style={{ marginBottom: '0.25rem' }}>Funniest</li>
                        <li style={{ marginBottom: '0.25rem' }}>Most knowledgeable about the topic</li>
                        <li style={{ marginBottom: '0.25rem' }}>Most knowledgeable about the world and the UN</li>
                        <li style={{ marginBottom: '0.25rem' }}>Most creative</li>
                        <li style={{ marginBottom: '0.25rem' }}>Most random</li>
                        <li style={{ marginBottom: '0.25rem' }}>Most reliable</li>
                        <li style={{ marginBottom: '0.25rem' }}>Best networker</li>
                        <li style={{ marginBottom: '0.25rem' }}>Most helpful</li>
                        <li style={{ marginBottom: '0.25rem' }}>Most respected</li>
                    </ul>
                </div>
            </div>
        </ContentPage>
    );
}
