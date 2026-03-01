import Navbar from '@/components/Navbar';
import BackToHomeButton from '@/components/BackToHomeButton';

export default function LoadingProfile() {
    return (
        <>
            <Navbar />
            <main className="main">
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>

                    <BackToHomeButton />

                    {/* Skeleton Profile Header */}
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
                            <div className="skeleton" style={{ width: '100px', height: '100px', borderRadius: '50%' }}></div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <div className="skeleton" style={{ height: '28px', width: '250px', marginBottom: '12px', borderRadius: '4px' }}></div>
                            <div className="skeleton" style={{ height: '16px', width: '200px', marginBottom: '8px', borderRadius: '4px' }}></div>
                            <div className="skeleton" style={{ height: '14px', width: '150px', borderRadius: '4px' }}></div>
                        </div>
                    </div>

                    {/* Skeleton Personal Details Form */}
                    <div style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '16px',
                        padding: '2rem',
                        marginBottom: '2rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                    }}>
                        <div className="skeleton" style={{ height: '24px', width: '180px', marginBottom: '24px', borderRadius: '4px' }}></div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <div className="skeleton" style={{ height: '16px', width: '80px', marginBottom: '8px', borderRadius: '4px' }}></div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <div className="skeleton" style={{ height: '44px', flex: 1, borderRadius: '8px' }}></div>
                                    <div className="skeleton" style={{ height: '44px', width: '80px', borderRadius: '8px' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Skeleton Tracked Conferences */}
                    <div style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '16px',
                        padding: '2rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                    }}>
                        <div className="skeleton" style={{ height: '24px', width: '200px', marginBottom: '24px', borderRadius: '4px' }}></div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[1, 2].map(i => (
                                <div key={i} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '1rem',
                                    border: '1px solid #f1f5f9',
                                    borderRadius: '10px'
                                }}>
                                    <div>
                                        <div className="skeleton" style={{ height: '16px', width: '180px', marginBottom: '8px', borderRadius: '4px' }}></div>
                                        <div className="skeleton" style={{ height: '14px', width: '120px', borderRadius: '4px' }}></div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div className="skeleton" style={{ height: '20px', width: '64px', borderRadius: '999px' }}></div>
                                        <div className="skeleton" style={{ height: '32px', width: '56px', borderRadius: '4px' }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </main>
        </>
    );
}
