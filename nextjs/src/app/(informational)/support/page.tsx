import ContentPage from '@/components/ContentPage';
import Link from 'next/link';

export default function SupportPage() {
    return (
        <ContentPage title="🤝 Support at Conferences">
            <p style={{ textAlign: 'center', marginBottom: '2rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                SEAMUNs conferences aim to be inclusive and supportive. Here's what to expect and how to get help.
            </p>

            <div style={{ display: 'grid', gap: '2rem', textAlign: 'left' }}>
                <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1.5rem', borderRadius: '16px' }}>
                    <h3 style={{ marginTop: 0, color: 'var(--text-primary)', fontFamily: "'Clash Display', sans-serif" }}>
                        ♿ Accessibility
                    </h3>
                    <ul style={{ marginLeft: '1.5rem', marginBottom: 0 }}>
                        <li style={{ marginBottom: '0.5rem' }}>Many conferences note wheelchair access and sensory-friendly options (e.g. quiet rooms) on their detail page—check under accessibility or venue.</li>
                        <li style={{ marginBottom: '0.5rem' }}>Contact the conference's general email before the event to request specific accommodations.</li>
                    </ul>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1.5rem', borderRadius: '16px' }}>
                    <h3 style={{ marginTop: 0, color: 'var(--text-primary)', fontFamily: "'Clash Display', sans-serif" }}>
                        📌 During the conference
                    </h3>
                    <ul style={{ marginLeft: '1.5rem', marginBottom: 0 }}>
                        <li style={{ marginBottom: '0.5rem' }}><strong>Advisors</strong> — Your school's advisor is your first point of contact for logistics, conduct, and well-being.</li>
                        <li style={{ marginBottom: '0.5rem' }}><strong>Secretariat</strong> — For procedure, complaints, or safety, approach the secretariat or staff.</li>
                        <li style={{ marginBottom: '0.5rem' }}><strong>Chairs</strong> — For committee-specific questions (e.g. speaking order, motions), address the chair when recognized.</li>
                    </ul>
                </div>
            </div>

            <p style={{ marginTop: '2rem', padding: '1rem', background: 'var(--bg-glass)', borderRadius: '8px', borderLeft: '4px solid var(--accent-blue)', color: 'var(--text-secondary)' }}>
                If you feel unsafe or experience harassment, report it to the secretariat or an advisor immediately. Conferences should have a code of conduct; see <Link href="/conduct">Conduct & Decorum</Link> for general guidelines.
            </p>
        </ContentPage>
    );
}
