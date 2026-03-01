import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { getUserProfile, getTrackedConferences, updateProfile } from '@/lib/actions';
import Link from 'next/link';
import BackToHomeButton from '@/components/BackToHomeButton';
import Image from 'next/image';

export default async function ProfilePage() {
    const user = await currentUser();

    if (!user) {
        redirect('/sign-in');
    }

    // Fetch data from our DB
    const dbUser = await getUserProfile();
    const conferences = await getTrackedConferences();

    return (
        <>
            <Navbar />
            <main className="main">
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <BackToHomeButton />

                    {/* Profile Header */}
                    <div style={{
                        background: '#ffffff',
                        border: '2px solid #e0eaf5',
                        borderRadius: '20px',
                        padding: '2.5rem',
                        marginBottom: '2rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2rem',
                        flexWrap: 'wrap'
                    }}>
                        <div style={{ flexShrink: 0 }}>
                            {user.imageUrl && (
                                <Image
                                    src={user.imageUrl}
                                    alt="Profile"
                                    width={100}
                                    height={100}
                                    style={{
                                        borderRadius: '50%',
                                        border: '4px solid #e0eaf5',
                                    }}
                                />
                            )}
                        </div>
                        <div style={{ flex: 1 }}>
                            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1e293b' }}>
                                {user.firstName} {user.lastName}
                            </h1>
                            <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '0.25rem' }}>
                                {user.emailAddresses[0]?.emailAddress}
                            </p>
                            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                                Member since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                    </div>

                    {/* Personal Details Form */}
                    <div style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '16px',
                        padding: '2rem',
                        marginBottom: '2rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                    }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', color: '#334155' }}>
                            <i className="fas fa-user-edit" style={{ marginRight: '0.5rem', color: '#3b82f6' }}></i>
                            Your Details
                        </h2>
                        <form action={async (formData) => {
                            'use server';
                            await updateProfile(formData);
                        }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label htmlFor="pronouns" style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: '#475569', marginBottom: '0.5rem' }}>
                                    Pronouns
                                </label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input
                                        type="text"
                                        name="pronouns"
                                        id="pronouns"
                                        placeholder="e.g. they/them"
                                        defaultValue={dbUser?.pronouns || ''}
                                        style={{
                                            flex: 1,
                                            padding: '0.75rem 1rem',
                                            borderRadius: '8px',
                                            border: '1px solid #cbd5e1',
                                            fontSize: '0.95rem',
                                            outline: 'none',
                                            transition: 'border-color 0.2s'
                                        }}
                                    />
                                    <button type="submit" className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem' }}>
                                        Save
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Tracked Conferences */}
                    <div style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '16px',
                        padding: '2rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                    }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', color: '#334155' }}>
                            <i className="fas fa-calendar-check" style={{ marginRight: '0.5rem', color: '#10b981' }}></i>
                            My Conferences
                        </h2>

                        {conferences.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                                <p>You haven't tracked any conferences yet.</p>
                                <Link href="/" style={{ display: 'inline-block', marginTop: '1rem', color: '#3b82f6', fontWeight: 500 }}>
                                    Browse Conferences &rarr;
                                </Link>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {conferences.map((conf: any) => (
                                    <div key={conf.conference_id} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '1rem',
                                        border: '1px solid #f1f5f9',
                                        borderRadius: '10px',
                                        transition: 'background 0.2s'
                                    }}>
                                        <div>
                                            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.25rem' }}>
                                                {conf.name}
                                            </h3>
                                            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                                {new Date(conf.start_date).toLocaleDateString()} &bull; {conf.location}
                                            </p>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '999px',
                                                fontSize: '0.75rem',
                                                fontWeight: 500,
                                                background: conf.attendance_status === 'attending' ? '#dcfce7' : '#f1f5f9',
                                                color: conf.attendance_status === 'attending' ? '#166534' : '#64748b'
                                            }}>
                                                {conf.attendance_status === 'attending' ? 'Attending' : 'Saved'}
                                            </span>
                                            <Link href={`/conference/${conf.conference_id}`} className="btn btn-sm btn-secondary">
                                                View
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </main>
        </>
    );
}
