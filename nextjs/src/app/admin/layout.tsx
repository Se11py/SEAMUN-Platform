import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await currentUser();

    if (!user) {
        redirect('/sign-in');
    }

    // Simple RBAC: Check against comma-separated list of admin emails
    const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim().toLowerCase()) || [];
    const userEmail = user.emailAddresses[0]?.emailAddress?.toLowerCase();

    const isAdmin = userEmail && adminEmails.includes(userEmail);

    if (!isAdmin) {
        // Or you could redirect to a specific "Access Denied" page
        redirect('/');
    }

    return (
        <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
            {/* Admin Sidebar */}
            <aside className="admin-sidebar" style={{
                width: '250px',
                background: '#ffffff',
                borderRight: '1px solid #e2e8f0',
                padding: '2rem 1rem',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{ marginBottom: '2rem', padding: '0 1rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0f172a' }}>SEAMUN Admin</h2>
                    <p style={{ fontSize: '0.875rem', color: '#64748b' }}>{userEmail}</p>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Link href="/admin" style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '0.5rem',
                        background: '#eff6ff',
                        color: '#1d4ed8',
                        fontWeight: '500',
                        textDecoration: 'none'
                    }}>
                        <i className="fas fa-list" style={{ width: '20px' }}></i> Conferences
                    </Link>
                    <Link href="/" style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '0.5rem',
                        color: '#475569',
                        fontWeight: '500',
                        textDecoration: 'none',
                        marginTop: 'auto'
                    }}>
                        <i className="fas fa-home" style={{ width: '20px' }}></i> Back to Site
                    </Link>
                </nav>
            </aside>

            {/* Admin Main Content */}
            <main className="admin-main" style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
                {children}
            </main>
        </div>
    );
}
