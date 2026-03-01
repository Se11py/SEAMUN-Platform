import Navbar from '@/components/Navbar';
import BackToHomeButton from '@/components/BackToHomeButton';

export default function LoadingConferenceDetail() {
    return (
        <>
            <Navbar />
            <main className="main">
                <div className="container" style={{ maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
                    <div className="conference-grid" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>

                        <BackToHomeButton />

                        <section className="conf-detail-hero">
                            {/* Skeleton Title */}
                            <div className="skeleton" style={{ height: '48px', width: '70%', borderRadius: '8px', marginBottom: '24px' }}></div>

                            {/* Skeleton Attendance Button */}
                            <div className="skeleton" style={{ height: '44px', width: '250px', borderRadius: '22px', margin: '1.5rem 0' }}></div>

                            {/* Skeleton Info Grid */}
                            <div className="conf-detail-info-grid">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="conf-detail-info-item">
                                        <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '8px' }}></div>
                                        <div>
                                            <div className="skeleton" style={{ height: '12px', width: '60px', marginBottom: '8px', borderRadius: '4px' }}></div>
                                            <div className="skeleton" style={{ height: '16px', width: '120px', borderRadius: '4px' }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Skeleton Registration Links */}
                            <div className="conf-detail-registration">
                                <div className="skeleton" style={{ height: '24px', width: '150px', marginBottom: '16px', borderRadius: '4px' }}></div>
                                <div className="skeleton" style={{ height: '44px', width: '100%', borderRadius: '22px', marginBottom: '8px' }}></div>
                                <div className="skeleton" style={{ height: '44px', width: '100%', borderRadius: '22px' }}></div>
                            </div>
                        </section>

                        <div className="conference-main-content">
                            <div className="conference-main">
                                {/* Skeleton Deadlines */}
                                <section className="conf-detail-deadlines-section">
                                    <div className="skeleton" style={{ height: '20px', width: '200px', marginBottom: '16px', borderRadius: '4px' }}></div>
                                    <div className="conf-detail-deadlines-card">
                                        <div className="skeleton" style={{ height: '60px', width: '100%', borderRadius: '8px', marginBottom: '12px' }}></div>
                                        <div className="skeleton" style={{ height: '60px', width: '100%', borderRadius: '8px' }}></div>
                                    </div>
                                </section>

                                {/* Skeleton Committees */}
                                <section className="conf-detail-committees-section">
                                    <div className="skeleton" style={{ height: '32px', width: '180px', marginBottom: '24px', borderRadius: '4px' }}></div>
                                    <div className="conf-detail-committees-grid">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="conf-detail-committee-card">
                                                <div className="skeleton" style={{ height: '60px', width: '100%', borderRadius: '8px', marginBottom: '16px' }}></div>
                                                <div className="skeleton" style={{ height: '20px', width: '100%', borderRadius: '4px', marginBottom: '8px' }}></div>
                                                <div className="skeleton" style={{ height: '20px', width: '80%', borderRadius: '4px' }}></div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </>
    );
}
