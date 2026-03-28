import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { userHasAdminEmail } from '@/lib/admin-auth';
import '../admin.css';

export default async function AdminProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await currentUser();

    if (!user) {
        redirect('/sign-in');
    }

    if (!userHasAdminEmail(user)) {
        redirect('/admin/access-denied');
    }

    const userEmail =
        user.primaryEmailAddress?.emailAddress ??
        user.emailAddresses[0]?.emailAddress ??
        '';

    return (
        <div className="adm-layout">
            <aside className="adm-sidebar">
                <div className="adm-sidebar-brand">
                    <h2>SEAMUN Admin</h2>
                    <p>{userEmail}</p>
                </div>

                <nav className="adm-sidebar-nav">
                    <Link href="/admin" className="adm-sidebar-link active">
                        <i className="fas fa-globe-americas"></i>
                        Conferences
                    </Link>
                    <div className="adm-sidebar-spacer" />
                </nav>

                <div className="adm-sidebar-footer">
                    <Link href="/" className="adm-sidebar-footer-link">
                        <i className="fas fa-arrow-left"></i>
                        <span>Back to Site</span>
                    </Link>
                </div>
            </aside>

            <main className="adm-main">
                {children}
            </main>
        </div>
    );
}
