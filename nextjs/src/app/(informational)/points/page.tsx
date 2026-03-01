import ContentPage from '@/components/ContentPage';

export default function PointsPage() {
    return (
        <ContentPage title="✋ Points">
            <p style={{ textAlign: 'center', marginBottom: '2rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                Points are formal requests to the chair during debate. Raise your placard and wait to be recognized before speaking.
            </p>

            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '2rem', borderRadius: '16px', textAlign: 'left' }}>
                <h3 style={{ marginTop: 0, color: 'var(--text-primary)', fontFamily: "'Clash Display', sans-serif" }}>
                    📌 Common points
                </h3>
                <ul style={{ marginLeft: '1.5rem', marginBottom: '2rem' }}>
                    <li style={{ marginBottom: '0.75rem' }}><strong>Point of Order</strong> — Correct a procedural error (e.g. wrong speaker, wrong motion). No debate.</li>
                    <li style={{ marginBottom: '0.75rem' }}><strong>Point of Information</strong> — Question to the speaker. Usually allowed after a speech if the speaker accepts.</li>
                    <li style={{ marginBottom: '0.75rem' }}><strong>Point of Inquiry (or Parliamentary Inquiry)</strong> — Question to the chair about procedure or rules.</li>
                    <li style={{ marginBottom: '0.75rem' }}><strong>Point of Personal Privilege</strong> — Request about comfort or safety (e.g. cannot hear, room temperature).</li>
                    <li style={{ marginBottom: '0.75rem' }}><strong>Point of Clarification</strong> — Request clarification of something said; often used like Point of Information.</li>
                </ul>

                <p style={{ margin: 0, padding: '1rem', background: 'var(--bg-glass)', borderRadius: '8px', borderLeft: '4px solid var(--accent-blue)', color: 'var(--text-secondary)' }}>
                    Rules vary by conference. Follow the chair's ruling and the conference's rules of procedure.
                </p>
            </div>
        </ContentPage>
    );
}
