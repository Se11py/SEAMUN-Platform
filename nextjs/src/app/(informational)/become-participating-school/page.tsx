import ContentPage from '@/components/ContentPage';
import Link from 'next/link';

export default function BecomeParticipatingSchoolPage() {
    return (
        <ContentPage title="🤝 How to Become a Participating School">
            <p style={{ textAlign: 'center', marginBottom: '2rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                Schools “participate” in SEAMUNs by sending delegations to conferences listed on our site. There is no separate membership—if your school attends or hosts a listed conference, it is part of the SEAMUNs community.
            </p>

            <div style={{ display: 'grid', gap: '2rem', textAlign: 'left' }}>
                <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1.5rem', borderRadius: '16px' }}>
                    <h3 style={{ marginTop: 0, color: 'var(--text-primary)', fontFamily: "'Clash Display', sans-serif" }}>
                        To send delegates
                    </h3>
                    <ul style={{ marginLeft: '1.5rem', marginBottom: 0 }}>
                        <li style={{ marginBottom: '0.5rem' }}>Designate an MUN advisor (teacher or staff) to coordinate registrations.</li>
                        <li style={{ marginBottom: '0.5rem' }}>
                            Browse <Link href="/">Upcoming & Previous MUNs</Link>, pick conferences, and use each conference's <strong>advisor signup link</strong> to register your delegation.
                        </li>
                        <li style={{ marginBottom: '0.5rem' }}>
                            Pay fees and submit delegate lists by the deadlines; help delegates with position papers and prep (see <Link href="/how-to-prep">How to Prep</Link> and <Link href="/advisor-guide">Advisor Guide</Link>).
                        </li>
                    </ul>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1.5rem', borderRadius: '16px' }}>
                    <h3 style={{ marginTop: 0, color: 'var(--text-primary)', fontFamily: "'Clash Display', sans-serif" }}>
                        🏢 To host a conference
                    </h3>
                    <p style={{ marginBottom: 0 }}>
                        If your school runs a MUN conference, see <Link href="/how-to-host">How to Host a MUN</Link>. Once the conference is listed on SEAMUNs, your school will appear under <Link href="/participating-schools">Participating Schools</Link>.
                    </p>
                </div>
            </div>
        </ContentPage>
    );
}
