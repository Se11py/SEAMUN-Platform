import ContentPage from '@/components/ContentPage';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Resources - SEAMUNs',
    description: 'A comprehensive collection of guides, templates, and rules for Model United Nations participants.',
};

export default function ResourcesPage() {
    return (
        <ContentPage title="SEAMUNs Resources">
            <div className="content-section" style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <h2>Comprehensive MUN Guides</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '24px' }}>
                    <div className="resource-card" style={{ padding: '24px', border: '1px solid var(--separator)', borderRadius: '8px' }}>
                        <h3><i className="fas fa-list-ol" style={{ marginRight: '8px', color: 'var(--primary)' }}></i>Points & Motions</h3>
                        <p style={{ margin: '12px 0' }}>Learn the correct parliamentary procedure for raising points and motions during debate.</p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <Link href="/points/" style={{ fontWeight: 600, color: 'var(--primary)' }}>View Points</Link>
                            <Link href="/motions/" style={{ fontWeight: 600, color: 'var(--primary)' }}>View Motions</Link>
                        </div>
                    </div>
                    <div className="resource-card" style={{ padding: '24px', border: '1px solid var(--separator)', borderRadius: '8px' }}>
                        <h3><i className="fas fa-file-word" style={{ marginRight: '8px', color: 'var(--primary)' }}></i>Written Documents</h3>
                        <p style={{ margin: '12px 0' }}>Master the art of drafting position papers, resolutions, and amendments.</p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <Link href="/position-papers/" style={{ fontWeight: 600, color: 'var(--primary)' }}>Position Papers</Link>
                            <Link href="/resolutions/" style={{ fontWeight: 600, color: 'var(--primary)' }}>Resolutions</Link>
                        </div>
                    </div>
                    <div className="resource-card" style={{ padding: '24px', border: '1px solid var(--separator)', borderRadius: '8px' }}>
                        <h3><i className="fas fa-globe-americas" style={{ marginRight: '8px', color: 'var(--primary)' }}></i>Committees</h3>
                        <p style={{ margin: '12px 0' }}>Explore traditional assemblies, special committees, and dynamic crisis rooms.</p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <Link href="/ga/" style={{ fontWeight: 600, color: 'var(--primary)' }}>General Assembly</Link>
                            <Link href="/crisis/" style={{ fontWeight: 600, color: 'var(--primary)' }}>Crisis Committees</Link>
                        </div>
                    </div>
                </div>

                <h2 style={{ marginTop: '48px' }}>Conference Organization</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '24px' }}>
                    <div className="resource-card" style={{ padding: '24px', border: '1px solid var(--separator)', borderRadius: '8px' }}>
                        <h3><i className="fas fa-hourglass-half" style={{ marginRight: '8px', color: 'var(--primary)' }}></i>Prospective MUNs</h3>
                        <p style={{ margin: '12px 0' }}>Discover upcoming conferences and learn how to host your own Model UN.</p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <Link href="/prospective-muns/" style={{ fontWeight: 600, color: 'var(--primary)' }}>Upcoming MUNs</Link>
                            <Link href="/how-to-host/" style={{ fontWeight: 600, color: 'var(--primary)' }}>How to Host</Link>
                        </div>
                    </div>

                    <div className="resource-card" style={{ padding: '24px', border: '1px solid var(--separator)', borderRadius: '8px' }}>
                        <h3><i className="fas fa-download" style={{ marginRight: '8px', color: 'var(--primary)' }}></i>Assets & Templates</h3>
                        <p style={{ margin: '12px 0' }}>Download official SEAMUNs resources, templates, and example documents.</p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <Link href="/templates/" style={{ fontWeight: 600, color: 'var(--primary)' }}>Templates</Link>
                            <Link href="/examples/" style={{ fontWeight: 600, color: 'var(--primary)' }}>Examples</Link>
                        </div>
                    </div>

                    <div className="resource-card" style={{ padding: '24px', border: '1px solid var(--separator)', borderRadius: '8px' }}>
                        <h3><i className="fas fa-file-alt" style={{ marginRight: '8px', color: 'var(--primary)' }}></i>Position Paper Archive</h3>
                        <p style={{ margin: '12px 0' }}>Browse real position papers shared by the MUN community for inspiration, including award-winning examples.</p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <Link href="/position-paper-archive" style={{ fontWeight: 600, color: 'var(--primary)' }}>Browse Archive</Link>
                        </div>
                    </div>

                    <div className="resource-card" style={{ padding: '24px', border: '1px solid var(--separator)', borderRadius: '8px' }}>
                        <h3><i className="fas fa-balance-scale" style={{ marginRight: '8px', color: 'var(--primary)' }}></i>Rules & Conduct</h3>
                        <p style={{ margin: '12px 0' }}>Read up on delegate expectations, superlative awards, and formal conduct.</p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <Link href="/conduct/" style={{ fontWeight: 600, color: 'var(--primary)' }}>Code of Conduct</Link>
                            <Link href="/awards/" style={{ fontWeight: 600, color: 'var(--primary)' }}>Awards</Link>
                        </div>
                    </div>
                </div>
            </div>
        </ContentPage>
    );
}
