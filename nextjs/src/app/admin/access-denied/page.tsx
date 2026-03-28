import Link from 'next/link';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getAdminEmailAllowlist, userHasAdminEmail } from '@/lib/admin-auth';

export default async function AdminAccessDeniedPage() {
    const user = await currentUser();
    if (!user) {
        redirect('/sign-in');
    }

    if (userHasAdminEmail(user)) {
        redirect('/admin');
    }

    const emails = user.emailAddresses.map((e) => e.emailAddress);
    const allowlist = getAdminEmailAllowlist();
    const isDev = process.env.NODE_ENV === 'development';

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                background: 'linear-gradient(165deg, #f1f5f9 0%, #e2e8f0 45%, #f8fafc 100%)',
            }}
        >
            <div
                style={{
                    maxWidth: '32rem',
                    width: '100%',
                    background: '#ffffff',
                    borderRadius: '1rem',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 20px 40px rgba(15, 23, 42, 0.08)',
                    padding: '2rem',
                }}
            >
                <h1 style={{ margin: '0 0 0.75rem 0', fontSize: '1.35rem', fontWeight: 700, color: '#0f172a' }}>
                    Admin access required
                </h1>
                <p style={{ margin: '0 0 1rem 0', color: '#475569', lineHeight: 1.55 }}>
                    You are signed in, but this account is not on the admin list. That is why visiting{' '}
                    <code style={{ background: '#f1f5f9', padding: '0.1rem 0.35rem', borderRadius: '0.25rem' }}>
                        /admin
                    </code>{' '}
                    did not open the dashboard.
                </p>
                <p style={{ margin: '0 0 1rem 0', color: '#475569', lineHeight: 1.55 }}>
                    Add one of your sign-in emails to <code style={{ background: '#f1f5f9', padding: '0.1rem 0.35rem', borderRadius: '0.25rem' }}>ADMIN_EMAILS</code> in{' '}
                    <code style={{ background: '#f1f5f9', padding: '0.1rem 0.35rem', borderRadius: '0.25rem' }}>.env.local</code>, restart the dev server, then try again.
                </p>
                <div
                    style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.5rem',
                        padding: '0.85rem 1rem',
                        marginBottom: '1.25rem',
                        fontSize: '0.875rem',
                        color: '#334155',
                    }}
                >
                    <div style={{ fontWeight: 600, marginBottom: '0.35rem' }}>Your account emails</div>
                    {emails.length ? (
                        <ul style={{ margin: 0, paddingLeft: '1.1rem' }}>
                            {emails.map((e) => (
                                <li key={e}>{e}</li>
                            ))}
                        </ul>
                    ) : (
                        <span>No email on file — add a verified email in Clerk.</span>
                    )}
                    {isDev && (
                        <div style={{ marginTop: '0.65rem', fontWeight: 600 }}>
                            Configured allowlist (dev only):{' '}
                            {allowlist.length ? allowlist.join(', ') : '(empty — set ADMIN_EMAILS)'}
                        </div>
                    )}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <Link
                        href="/"
                        style={{
                            background: '#1d4ed8',
                            color: 'white',
                            padding: '0.65rem 1.1rem',
                            borderRadius: '0.5rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                        }}
                    >
                        Back to home
                    </Link>
                    <Link
                        href="/sign-in"
                        style={{
                            background: '#f1f5f9',
                            color: '#334155',
                            padding: '0.65rem 1.1rem',
                            borderRadius: '0.5rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                        }}
                    >
                        Switch account
                    </Link>
                </div>
            </div>
        </div>
    );
}
