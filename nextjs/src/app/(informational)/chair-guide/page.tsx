import ContentPage from '@/components/ContentPage';
import Link from 'next/link';

export default function ChairGuidePage() {
    return (
        <ContentPage title="🔨 Chair Guide">
            <p className="section-intro" style={{ textAlign: 'center', marginBottom: '2rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                Chair report structure and content checklist for background guides and committee prep.
            </p>

            <Link href="/munsimulation" target="_blank" rel="noopener noreferrer" className="mun-simulation-ad" style={{ display: 'block', textDecoration: 'none', marginBottom: '24px', padding: '24px 28px', background: 'linear-gradient(135deg, rgba(43, 95, 166, 0.95) 0%, rgba(107, 76, 154, 0.95) 100%)', color: '#fff', borderRadius: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                    <div style={{ flexShrink: 0, width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fas fa-gamepad" style={{ fontSize: '28px' }}></i>
                    </div>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <strong style={{ display: 'block', fontSize: '1.1rem', marginBottom: '4px', fontWeight: 600 }}>MUN Procedure Simulation</strong>
                        <span style={{ opacity: 0.95, fontSize: '0.95rem', lineHeight: '1.5' }}>Single-player game to practice MUN procedure at your own pace — try it at munsimulation</span>
                    </div>
                    <span style={{ flexShrink: 0, padding: '10px 20px', background: 'rgba(255,255,255,0.25)', borderRadius: '10px', fontWeight: 600, fontSize: '0.9rem' }}>Play now →</span>
                </div>
            </Link>

            <div style={{ display: 'grid', gap: '2rem', textAlign: 'left' }}>
                {/* Chair Report Section */}
                <div className="info-card" style={{ background: 'rgba(255,255,255,0.6)', padding: '1.5rem', borderRadius: '16px' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--text-primary)', fontFamily: "'Clash Display', sans-serif" }}>
                        <i className="fas fa-file-alt" style={{ color: 'var(--accent-blue)' }}></i>
                        Chair Report
                    </h3>

                    <div style={{ background: 'var(--bg-glass)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '16px' }}>
                        <h4 style={{ marginBottom: '8px', color: 'var(--text-primary)', fontSize: '1em' }}>General Info</h4>
                        <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                            <li style={{ marginBottom: '0.25rem' }}>Cover page</li>
                            <li style={{ marginBottom: '0.25rem' }}>Conference logo</li>
                            <li style={{ marginBottom: '0.25rem' }}>Committee name and topics</li>
                            <li style={{ marginBottom: '0.25rem' }}>Chair role, name, and email</li>
                            <li style={{ marginBottom: '0.25rem' }}>Chair introduction</li>
                            <li style={{ marginBottom: '0.25rem' }}>Blurb and image</li>
                        </ul>
                    </div>

                    <div style={{ background: 'var(--bg-glass)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '16px' }}>
                        <h4 style={{ marginBottom: '8px', color: 'var(--text-primary)', fontSize: '1em' }}>Committee Overview</h4>
                        <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                            <li style={{ marginBottom: '0.25rem' }}>Committee: what is this committee? What issues do they deal with?</li>
                            <li style={{ marginBottom: '0.25rem' }}>Topic introduction: what topics will be debated?</li>
                            <li style={{ marginBottom: '0.25rem' }}>Expectation: how should the committee be? What should be achieved at the end of the conference?</li>
                            <li style={{ marginBottom: '0.25rem' }}>Procedure in use: which MUN procedure will be followed for this conference?</li>
                        </ul>
                    </div>

                    <div style={{ background: 'var(--bg-glass)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <h4 style={{ marginBottom: '8px', color: 'var(--text-primary)', fontSize: '1em' }}>Important Notes</h4>
                        <p style={{ margin: '0 0 8px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>Auxiliary information that delegates should know prior to the debates.</p>
                        <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                            <li style={{ marginBottom: '0.25rem' }}>Mentions of plagiarism, AI, and citations (chair digressions)</li>
                            <li style={{ marginBottom: '0.25rem' }}>Chair report should not be used as the only source of information</li>
                            <li style={{ marginBottom: '0.25rem' }}>Other housekeeping rules for these specific committees</li>
                        </ul>
                    </div>
                </div>

                {/* Per Topic Section */}
                <div className="info-card" style={{ background: 'rgba(255,255,255,0.6)', padding: '1.5rem', borderRadius: '16px' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--text-primary)', fontFamily: "'Clash Display', sans-serif" }}>
                        <i className="fas fa-list" style={{ color: 'var(--accent-purple)' }}></i>
                        Per Topic
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                        <div style={{ background: 'var(--bg-glass)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                            <h4 style={{ marginBottom: '8px', color: 'var(--text-primary)', fontSize: '1em' }}>Key Terms</h4>
                            <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.5' }}>10+ key terms</p>
                        </div>
                        <div style={{ background: 'var(--bg-glass)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                            <h4 style={{ marginBottom: '8px', color: 'var(--text-primary)', fontSize: '1em' }}>Topic Introduction</h4>
                            <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                <li style={{ marginBottom: '0.25rem' }}>Define key terms for any words in the topic of discussion</li>
                                <li style={{ marginBottom: '0.25rem' }}>Outline positive and negative impacts to the world or countries related</li>
                                <li style={{ marginBottom: '0.25rem' }}>Brief history: how did the topic become an issue? What factors influenced it?</li>
                                <li style={{ marginBottom: '0.25rem' }}>Note: introduction can link to other sections without full elaboration</li>
                            </ul>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                        <div style={{ background: 'var(--bg-glass)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                            <h4 style={{ marginBottom: '8px', color: 'var(--text-primary)', fontSize: '1em' }}>Historical Context</h4>
                            <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                <li style={{ marginBottom: '0.25rem' }}>How did it begin? What happened after the initial event?</li>
                                <li style={{ marginBottom: '0.25rem' }}>Events that exacerbated the issue</li>
                                <li style={{ marginBottom: '0.25rem' }}>Graphs or statistics showing changes over the years</li>
                                <li style={{ marginBottom: '0.25rem' }}>Current state and consequences of historical events</li>
                                <li style={{ marginBottom: '0.25rem' }}>Graphs and statistics are permitted; do not insert a timeline here</li>
                            </ul>
                        </div>
                        <div style={{ background: 'var(--bg-glass)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                            <h4 style={{ marginBottom: '8px', color: 'var(--text-primary)', fontSize: '1em' }}>Timeline</h4>
                            <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.5' }}>Significant events related to the topic (e.g., legislation passing, new innovations, etc.).</p>
                        </div>
                    </div>

                    <div style={{ background: 'var(--bg-glass)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '16px' }}>
                        <h4 style={{ marginBottom: '8px', color: 'var(--text-primary)', fontSize: '1em' }}>Global Reform Efforts</h4>
                        <p style={{ margin: '0 0 8px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>Only needed in the first topic as the efforts cover all committee focus areas.</p>
                        <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                            <li style={{ marginBottom: '0.25rem' }}>Outline solutions implemented by organizations or the UN in chronological order</li>
                            <li style={{ marginBottom: '0.25rem' }}>What happened on that date? What policies were implemented?</li>
                            <li style={{ marginBottom: '0.25rem' }}>Short comment on effectiveness</li>
                            <li style={{ marginBottom: '0.25rem' }}>Conferences and conventions</li>
                            <li style={{ marginBottom: '0.25rem' }}>National and international policies</li>
                            <li style={{ marginBottom: '0.25rem' }}>Agreements and treaties</li>
                            <li style={{ marginBottom: '0.25rem' }}>International aids (if applicable)</li>
                            <li style={{ marginBottom: '0.25rem' }}>Organization involved</li>
                            <li style={{ marginBottom: '0.25rem' }}>UN-related activities</li>
                            <li style={{ marginBottom: '0.25rem' }}>Other forms of international communications</li>
                        </ul>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                        <div style={{ background: 'var(--bg-glass)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                            <h4 style={{ marginBottom: '8px', color: 'var(--text-primary)', fontSize: '1em' }}>Bloc Position</h4>
                            <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                <li style={{ marginBottom: '0.25rem' }}>Outline blocs and sub-blocs aligned to collective needs</li>
                                <li style={{ marginBottom: '0.25rem' }}>List state members likely in each bloc or sub-bloc</li>
                                <li style={{ marginBottom: '0.25rem' }}>One sentence on what each bloc wants to achieve</li>
                            </ul>
                        </div>
                        <div style={{ background: 'var(--bg-glass)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                            <h4 style={{ marginBottom: '8px', color: 'var(--text-primary)', fontSize: '1em' }}>Possible Solutions</h4>
                            <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.5' }}>Outline key aspects that need resolution and approaches delegates may use in their resolutions.</p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                        <div style={{ background: 'var(--bg-glass)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                            <h4 style={{ marginBottom: '8px', color: 'var(--text-primary)', fontSize: '1em' }}>Subtopics</h4>
                            <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.5' }}>Further topics for nuanced debate that connect to the bigger picture.</p>
                        </div>
                        <div style={{ background: 'var(--bg-glass)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                            <h4 style={{ marginBottom: '8px', color: 'var(--text-primary)', fontSize: '1em' }}>Questions to Consider</h4>
                            <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.5' }}>Broad open-ended questions for POC/POI and resolution drafting.</p>
                        </div>
                    </div>

                    <div style={{ background: 'var(--bg-glass)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <h4 style={{ marginBottom: '8px', color: 'var(--text-primary)', fontSize: '1em' }}>Further Reading and Resources</h4>
                        <p style={{ margin: '0 0 8px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>Bibliography</p>
                    </div>
                </div>
            </div>
        </ContentPage>
    );
}
