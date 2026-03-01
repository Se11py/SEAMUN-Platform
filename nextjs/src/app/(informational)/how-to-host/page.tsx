import ContentPage from '@/components/ContentPage';
import Link from 'next/link';

export default function HowToHostPage() {
    return (
        <ContentPage title="🏢 How to Host a MUN">
            <p style={{ textAlign: 'center', marginBottom: '2rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                Hosting a MUN conference takes planning, a venue, and a strong secretariat and chair team. Here's a short overview.
            </p>

            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '2rem', borderRadius: '16px', textAlign: 'left' }}>
                <h3 style={{ marginTop: 0, color: 'var(--text-primary)', fontFamily: "'Clash Display', sans-serif" }}>
                    📋 Key steps
                </h3>
                <ul style={{ marginLeft: '1.5rem', marginBottom: '2rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Team</strong> — Secretary-General, crisis director (if applicable), committee chairs, logistics, and tech.</li>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Venue</strong> — Rooms for each committee, opening/closing ceremonies, and space for registration and breaks.</li>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Date & capacity</strong> — Choose a date that doesn't clash with other MUNs; set delegate capacity and fees.</li>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Topics & committees</strong> — Publish committee list, topics, and country allocations.</li>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Registration</strong> — Advisor and (if allowed) individual signup links; deadlines for registration, fees, and position papers.</li>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Communication</strong> — Email and/or social media for updates; share rules of procedure and schedule.</li>
                </ul>

                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95em' }}>
                    Once your conference is confirmed, you can list it on SEAMUNs. For prospective conferences, see <Link href="/prospective-muns">Prospective MUNs</Link>; for contact and listing info, see <Link href="/about">About & Contact</Link>.
                </p>
            </div>
        </ContentPage>
    );
}
