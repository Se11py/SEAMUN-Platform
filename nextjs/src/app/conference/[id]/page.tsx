import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import BackToHomeButton from '@/components/BackToHomeButton';
import Breadcrumbs from '@/components/Breadcrumbs';
import { currentUser } from '@clerk/nextjs/server';
import Navbar from '@/components/Navbar';
import CopyButton from '@/components/CopyButton';
import AttendanceButton from '@/components/AttendanceButton';
import { getDb } from '@/lib/db';
import { getConferenceAttendanceStatus } from '@/lib/actions';
export async function generateStaticParams() {
    const db = getDb();
    const result = await db.query('SELECT conference_id FROM conferences');
    return result.rows.map((row: any) => ({
        id: row.conference_id.toString(),
    }));
}

export async function generateMetadata({ params }: ConferencePageProps): Promise<Metadata> {
    const { id } = await params;
    const db = getDb();
    const result = await db.query('SELECT name, description, location, start_date, end_date FROM conferences WHERE conference_id = $1', [parseInt(id)]);
    if (result.rows.length === 0) return {};
    const conf = result.rows[0];
    const title = conf.name;
    const description = conf.description || `${conf.name} - Model United Nations conference in ${conf.location}`;
    return {
        title,
        description,
        alternates: {
            canonical: `/conference/${id}`,
        },
        openGraph: {
            title: `${title} | SEAMUNs`,
            description,
            type: 'article',
        },
    };
}

interface ConferencePageProps {
    params: Promise<{ id: string }>;
}

export default async function ConferencePage({ params }: ConferencePageProps) {
    const { id } = await params;
    const conferenceId = parseInt(id);
    const db = getDb();

    // Fetch conference data
    const confResult = await db.query('SELECT * FROM conferences WHERE conference_id = $1', [conferenceId]);

    if (confResult.rows.length === 0) {
        notFound();
    }

    const confData = confResult.rows[0];

    // Fetch related data in parallel
    const [committeesRes, uniqueTopicsRes, awardsRes, allocationsRes] = await Promise.all([
        db.query('SELECT * FROM committees WHERE conference_id = $1 ORDER BY committee_id', [conferenceId]),
        db.query('SELECT topic FROM unique_topics WHERE conference_id = $1', [conferenceId]),
        db.query('SELECT award_name FROM available_awards WHERE conference_id = $1', [conferenceId]),
        db.query('SELECT country FROM allocations WHERE conference_id = $1', [conferenceId])
    ]);

    // Construct Conference object matching the interface
    const conference: any = {
        id: confData.conference_id,
        name: confData.name,
        organization: confData.organization,
        location: confData.location,
        countryCode: confData.country_code,
        startDate: new Date(confData.start_date).toISOString(),
        endDate: new Date(confData.end_date).toISOString(),
        description: confData.description,
        website: confData.website,
        registrationDeadline: confData.registration_deadline ? new Date(confData.registration_deadline).toDateString() : null,
        positionPaperDeadline: confData.position_paper_deadline ? new Date(confData.position_paper_deadline).toDateString() : null,
        status: confData.status,
        size: confData.size,
        generalEmail: confData.general_email,
        munAccount: confData.mun_account,
        advisorAccount: confData.advisor_account,
        secGenAccounts: confData.sec_gen_accounts,
        parliamentarianAccounts: confData.parliamentarian_accounts,
        pricePerDelegate: confData.price_per_delegate,
        independentDelsWelcome: confData.independent_dels_welcome,
        independentSignupLink: confData.independent_signup_link,
        advisorSignupLink: confData.advisor_signup_link,
        disabledSuitable: confData.disabled_suitable,
        sensorySuitable: confData.sensory_suitable,
        schedule: confData.schedule,
        venueGuide: confData.venue_guide,
        extraNotes: confData.extra_notes,

        // Reconstruct arrays
        uniqueTopics: uniqueTopicsRes.rows.map((r: any) => r.topic),
        availableAwards: awardsRes.rows.map((r: any) => r.award_name),
        allocations: allocationsRes.rows.map((r: any) => r.country),

        // Reconstruct committees to match legacy string format for UI parsing
        // Format: "Name - Topic | Chair"
        committees: committeesRes.rows.map((c: any) => {
            let str = c.name;
            if (c.topic) str += ` - ${c.topic}`;
            if (c.chair_info) {
                // Check if chair info already has prefix, if not add it
                // Based on our init-db logic, chair_info usually comes from "Chairs: ..."
                // But for simple chair names it might be just name.
                // However, simpler to just append with pipe.
                str += ` | ${c.chair_info}`;
            }
            return str;
        })
    };

    const user = await currentUser();
    // Only fetch status if user is logged in
    const rawStatus = user ? await getConferenceAttendanceStatus(conferenceId) : null;
    const attendanceStatus = (rawStatus === 'saved' || rawStatus === 'attending' || rawStatus === 'not-attending')
        ? rawStatus
        : 'not-attending';

    const formatDate = (startDate: string, endDate: string) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };

        if (startDate === endDate) {
            return start.toLocaleDateString('en-US', options);
        }
        return `${start.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - ${end.toLocaleDateString('en-US', options)}`;
    };

    return (
        <>
            <Navbar />

            <main className="main">
                <div className="container" style={{ maxWidth: '1200px', width: '100%', margin: '0 auto' }}>

                    <div className="conference-grid" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>

                        {/* Breadcrumbs */}
                        <Breadcrumbs items={[
                            { label: 'Home', href: '/' },
                            { label: 'Conferences', href: '/' },
                            { label: conference.name },
                        ]} />

                        {/* Back to Home */}
                        <BackToHomeButton />

                        {/* JSON-LD Structured Data */}
                        <script
                            type="application/ld+json"
                            dangerouslySetInnerHTML={{
                                __html: JSON.stringify({
                                    '@context': 'https://schema.org',
                                    '@type': 'Event',
                                    name: conference.name,
                                    description: conference.description,
                                    startDate: conference.startDate,
                                    endDate: conference.endDate,
                                    location: {
                                        '@type': 'Place',
                                        name: conference.location,
                                        address: {
                                            '@type': 'PostalAddress',
                                            addressCountry: conference.countryCode,
                                        },
                                    },
                                    organizer: {
                                        '@type': 'Organization',
                                        name: conference.organization,
                                        ...(conference.website ? { url: conference.website } : {}),
                                    },
                                    eventStatus: 'https://schema.org/EventScheduled',
                                    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
                                    ...(conference.pricePerDelegate ? {
                                        offers: {
                                            '@type': 'Offer',
                                            price: conference.pricePerDelegate,
                                            priceCurrency: 'THB',
                                            availability: 'https://schema.org/InStock',
                                        },
                                    } : {}),
                                }),
                            }}
                        />

                        {/* Hero Header Section */}
                        <section className="conf-detail-hero">
                            {/* Title */}
                            <h1 className="conf-detail-title">{conference.name}</h1>

                            {/* Attendance Action */}
                            <div style={{ margin: '1.5rem 0' }}>
                                {user ? (
                                    <AttendanceButton
                                        conferenceId={conferenceId}
                                        initialStatus={attendanceStatus}
                                    />
                                ) : (
                                    <Link href="/sign-in" className="conf-detail-attendance-btn">
                                        <i className="fas fa-lock"></i>
                                        LOGIN TO MARK ATTENDANCE
                                    </Link>
                                )}
                            </div>

                            {/* Info Grid */}
                            <div className="conf-detail-info-grid">
                                <div className="conf-detail-info-item">
                                    <i className="fas fa-map-marker-alt"></i>
                                    <div>
                                        <span className="conf-detail-label">LOCATION</span>
                                        <span className="conf-detail-value">{conference.countryCode === 'TH' ? '🇹🇭 ' : ''}{conference.location}</span>
                                    </div>
                                </div>
                                <div className="conf-detail-info-item">
                                    <i className="fas fa-calendar-alt"></i>
                                    <div>
                                        <span className="conf-detail-label">DATE</span>
                                        <span className="conf-detail-value">{formatDate(conference.startDate, conference.endDate)}</span>
                                    </div>
                                </div>
                                <div className="conf-detail-info-item">
                                    <i className="fas fa-users"></i>
                                    <div>
                                        <span className="conf-detail-label">SIZE</span>
                                        <span className="conf-detail-value">{conference.size || 'TBD'}</span>
                                    </div>
                                </div>
                                <div className="conf-detail-info-item">
                                    <i className="fas fa-tag"></i>
                                    <div>
                                        <span className="conf-detail-label">FEE</span>
                                        <span className="conf-detail-value">{conference.pricePerDelegate || 'TBD'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Registration Links */}
                            <div className="conf-detail-registration">
                                <h3 className="conf-detail-section-label">Registration Links</h3>
                                {conference.advisorSignupLink && (
                                    <a href={conference.advisorSignupLink} target="_blank" rel="noopener noreferrer" className="conf-detail-signup-btn">
                                        <i className="fas fa-chalkboard-teacher"></i>
                                        SIGN UP YOUR SCHOOL
                                    </a>
                                )}
                                {conference.independentDelsWelcome && conference.independentSignupLink && (
                                    <a href={conference.independentSignupLink} target="_blank" rel="noopener noreferrer" className="conf-detail-signup-btn" style={{ marginTop: '0.5rem' }}>
                                        <i className="fas fa-user"></i>
                                        SIGN UP AS INDEPENDENT DELEGATE
                                    </a>
                                )}
                            </div>

                            {/* Contact Info */}
                            <div className="conf-detail-contact">
                                {conference.generalEmail && (
                                    <div className="conf-detail-contact-item">
                                        <i className="fas fa-envelope"></i>
                                        <span>{conference.generalEmail}</span>
                                    </div>
                                )}
                                {conference.munAccount && (
                                    <div className="conf-detail-contact-item">
                                        <i className="fab fa-instagram"></i>
                                        <span>{conference.munAccount} {conference.countryCode === 'TH' ? '🇹🇭' : ''}</span>
                                    </div>
                                )}
                                {conference.website && (
                                    <div className="conf-detail-contact-item">
                                        <i className="fas fa-globe"></i>
                                        <a href={conference.website} target="_blank" rel="noopener noreferrer">{conference.website}</a>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Main Content */}
                        <div className="conference-main-content">
                            <div className="conference-main">

                                {/* Organization & Deadlines */}
                                <section className="conf-detail-deadlines-section">
                                    <p className="conf-detail-org">{conference.organization}</p>

                                    <div className="conf-detail-deadlines-card">
                                        <div className="conf-detail-deadline-item">
                                            <span className="conf-detail-label">REGISTRATION CLOSES</span>
                                            <span className="conf-detail-deadline-value">{conference.registrationDeadline || 'Not specified - Check with organizers'}</span>
                                        </div>
                                        <div className="conf-detail-deadline-item">
                                            <span className="conf-detail-label">POSITION PAPER DUE</span>
                                            <span className="conf-detail-deadline-value">{conference.positionPaperDeadline || 'Not specified - Check with organizers'}</span>
                                        </div>
                                    </div>
                                </section>

                                {/* Unique Topics */}
                                {conference.uniqueTopics.length > 0 && (
                                    <section className="conf-detail-topics-section">
                                        <h3 className="conf-detail-topics-title">
                                            <i className="fas fa-lightbulb"></i> Unique Topics
                                        </h3>
                                        <div className="conf-detail-topics-grid">
                                            {conference.uniqueTopics.map((topic: string, index: number) => (
                                                <span key={index} className="conf-detail-topic-pill">
                                                    {topic}
                                                </span>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* Committees */}
                                <section className="conf-detail-committees-section">
                                    <h2 className="conf-detail-committees-heading">Committees</h2>
                                    <div className="conf-detail-committees-grid">
                                        {conference.committees.map((committee: string, index: number) => {
                                            // Parse committee string
                                            const parts = committee.split(' | ');
                                            const firstPart = parts[0] || '';

                                            // Extract abbreviation, full name, difficulty, and topic(s)
                                            let abbrev = '';
                                            let fullName = '';
                                            let difficulty = '';
                                            let topics: string[] = [];
                                            let chairInfo = '';

                                            // Check for "Topic 1:" format (THAIMUN style)
                                            const hasNumberedTopics = firstPart.includes('Topic 1:');

                                            if (hasNumberedTopics) {
                                                // Format: "WHO (World Health Organization) - Topic 1: ..."
                                                const dashIdx = firstPart.indexOf(' - Topic 1:');
                                                const headerPart = dashIdx > -1 ? firstPart.substring(0, dashIdx) : firstPart;
                                                const fullNameMatch = headerPart.match(/^([A-Z\s]+)\s*\(([^)]+)\)/);
                                                if (fullNameMatch) {
                                                    abbrev = fullNameMatch[1] || '';
                                                    fullName = fullNameMatch[2] || '';
                                                } else {
                                                    abbrev = headerPart.trim();
                                                }

                                                // Collect all topics from all parts
                                                const allText = committee;
                                                const topicMatches = allText.match(/Topic \d+:\s*([^|]+)/g);
                                                if (topicMatches) {
                                                    topics = topicMatches.map((t: string) => t.replace(/Topic \d+:\s*/, '').trim());
                                                }

                                                // Find chairs part
                                                const chairsPart = parts.find(p => p.trim().startsWith('Chairs:'));
                                                if (chairsPart) {
                                                    chairInfo = chairsPart.replace('Chairs:', '').trim();
                                                }
                                            } else {
                                                // Format: "UNHRC - The Question of ... | Chair: Name (@handle)"
                                                const dashMatch = firstPart.match(/^([A-Z\s/]+?)(?:\s*\(([^)]*)\))?\s*(?:\((\w+)\))?\s*-\s*(.+)/);
                                                if (dashMatch) {
                                                    abbrev = dashMatch[1] || '';
                                                    if (dashMatch[2]) fullName = dashMatch[2].trim();
                                                    if (dashMatch[3]) difficulty = dashMatch[3].trim();
                                                    topics = [(dashMatch[4] || '').trim()];
                                                } else {
                                                    topics = [firstPart];
                                                }

                                                // Check remaining parts for difficulty or chairs
                                                for (let i = 1; i < parts.length; i++) {
                                                    const part = parts[i]?.trim();
                                                    if (!part) continue;
                                                    if (part.startsWith('Chairs:')) {
                                                        chairInfo = part.replace('Chairs:', '').trim();
                                                    } else if (/^(Head\s*[Cc]hair|Deputy\s*[Cc]hair|President|Vice President|Editor|Deputy editor)/i.test(part)) {
                                                        chairInfo += (chairInfo ? ', ' : '') + part;
                                                    }
                                                }
                                            }

                                            // Check for difficulty in abbrev area like "ECOSOC (Beginner)"
                                            if (!difficulty) {
                                                const diffMatch = firstPart.match(/\((Beginner|Intermediate|Advanced)\)/i);
                                                if (diffMatch && diffMatch[1]) {
                                                    difficulty = diffMatch[1].toLowerCase();
                                                    // Clean it from fullName if it got captured there
                                                    if (fullName.toLowerCase() === difficulty) fullName = '';
                                                }
                                            }

                                            // Extract contacts from chairInfo (Instagram handles and emails)
                                            const contactMatches = chairInfo.match(/@[\w._]+|[\w.-]+@[\w.-]+\.\w+/g) || [];

                                            // Committee type emojis
                                            const getCommitteeEmoji = (name: string) => {
                                                const n = name.toUpperCase();
                                                if (n.includes('WHO')) return '❤️';
                                                if (n.includes('UNHRC') || n.includes('HRC')) return '⚖️';
                                                if (n.includes('ECOSOC')) return '💰';
                                                if (n.includes('UNICEF')) return '👶';
                                                if (n.includes('UNESCO')) return '🎓';
                                                if (n.includes('DISEC')) return '🛡️';
                                                if (n.includes('UNODC')) return '🔍';
                                                if (n.includes('UNSC')) return '🏛️';
                                                if (n.includes('UNEP')) return '🌍';
                                                if (n.includes('IOC')) return '🏅';
                                                if (n.includes('ICJ')) return '⚖️';
                                                if (n.includes('PRESS')) return '📰';
                                                if (n.includes('SPECPOL')) return '🔬';
                                                if (n.includes('HSC') || n.includes('HCC') || n.includes('HSOC')) return '📜';
                                                if (n.includes('INTERPOL')) return '🔎';
                                                if (n.includes('ASEAN')) return '🌏';
                                                if (n.includes('ARAB')) return '🕌';
                                                if (n.includes('WOMEN')) return '♀️';
                                                if (n.includes('UNOOSA')) return '🚀';
                                                if (n.includes('USCC')) return '🇺🇸';
                                                if (n.includes('UKPC')) return '🇬🇧';
                                                if (n.includes('EP')) return '🇪🇺';
                                                return '🌐';
                                            };

                                            // Topic border colors
                                            const topicColors = ['#4ade80', '#fbbf24', '#f87171', '#60a5fa', '#a78bfa'];

                                            // Difficulty badge colors
                                            const getDifficultyStyle = (diff: string) => {
                                                const d = diff.toLowerCase();
                                                if (d === 'beginner') return { bg: '#ecfdf5', color: '#059669', icon: '🌱' };
                                                if (d === 'intermediate') return { bg: '#fffbeb', color: '#d97706', icon: '⭐' };
                                                if (d === 'advanced') return { bg: '#fef2f2', color: '#dc2626', icon: '🔥' };
                                                return { bg: '#f0f9ff', color: '#0284c7', icon: '📌' };
                                            };

                                            // Determine committee type label
                                            const getTypeLabel = (name: string) => {
                                                const n = name.toUpperCase();
                                                if (n.includes('ICJ')) return 'JUDICIAL';
                                                if (n.includes('PRESS')) return 'PRESS';
                                                if (n.includes('HSC') || n.includes('HCC') || n.includes('HSOC')) return 'HISTORICAL';
                                                if (n.includes('UKPC') || n.includes('USCC') || n.includes('EP')) return 'PARLIAMENTARY';
                                                if (n.includes('INTERPOL') || n.includes('IOC') || n.includes('ARAB') || n.includes('ASEAN')) return 'SPECIALIZED';
                                                return 'GENERAL ASSEMBLY';
                                            };

                                            return (
                                                <div key={index} className="conf-detail-committee-card">
                                                    {/* Header */}
                                                    <div className="conf-detail-committee-header">
                                                        <div className="conf-detail-committee-emoji">
                                                            {getCommitteeEmoji(abbrev || firstPart)}
                                                        </div>
                                                        <div>
                                                            <h4 className="conf-detail-committee-abbrev">{abbrev || 'Committee'}</h4>
                                                            {fullName && <p className="conf-detail-committee-fullname">{fullName}</p>}
                                                            <span className="conf-detail-committee-type">{getTypeLabel(abbrev || firstPart)}</span>
                                                        </div>
                                                    </div>

                                                    {/* Topics */}
                                                    {topics.length > 0 && (
                                                        <div className="conf-detail-committee-topics">
                                                            <span className="conf-detail-label">TOPICS</span>
                                                            {topics.map((topic, ti) => {
                                                                const topicDiffMatch = topic.match(/\((Beginner|Intermediate|Advanced)\)/i);
                                                                const topicDiff = (topicDiffMatch && topicDiffMatch[1]) ? topicDiffMatch[1].toLowerCase() : (difficulty && ti === 0 ? difficulty : '');
                                                                const cleanTopic = topic.replace(/\((Beginner|Intermediate|Advanced)\)/i, '').trim();
                                                                const diffStyle = topicDiff ? getDifficultyStyle(topicDiff) : null;

                                                                return (
                                                                    <div key={ti} className="conf-detail-topic-block" style={{ borderLeftColor: topicColors[ti % topicColors.length] }}>
                                                                        <div className="conf-detail-topic-header">
                                                                            <span className="conf-detail-topic-num">Topic {ti + 1}</span>
                                                                            {diffStyle && (
                                                                                <span className="conf-detail-difficulty-badge" style={{ background: diffStyle.bg, color: diffStyle.color }}>
                                                                                    {diffStyle.icon} {topicDiff}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <p className="conf-detail-topic-text">{cleanTopic}</p>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}

                                                    {/* Chairs */}
                                                    <div className="conf-detail-committee-chairs">
                                                        <span className="conf-detail-chairs-label">📌 Chairs: {chairInfo || 'TBD'}</span>
                                                        {contactMatches.length > 0 && (
                                                            <div className="conf-detail-chair-contacts">
                                                                {contactMatches.map((contact, ci) => (
                                                                    <CopyButton
                                                                        key={ci}
                                                                        text={contact}
                                                                        isInstagram={contact.startsWith('@')}
                                                                        isEmail={!contact.startsWith('@') && contact.includes('@')}
                                                                    />
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>

                                {/* Chairs & Team */}
                                {conference.chairsPages && (
                                    <section className="conf-detail-chairs-section">
                                        <h3 className="conf-detail-section-title">
                                            <i className="fas fa-user-tie"></i> Chairs &amp; Team
                                        </h3>
                                        <div className="conf-detail-chairs-content" dangerouslySetInnerHTML={{ __html: conference.chairsPages }}></div>
                                    </section>
                                )}

                                {/* Allocations */}
                                {conference.allocations.length > 0 && (
                                    <section className="conf-detail-allocations-section">
                                        <h3 className="conf-detail-section-title">
                                            <i className="fas fa-flag"></i> Allocations
                                        </h3>
                                        <div className="conf-detail-allocations-grid">
                                            {conference.allocations.map((allocation: string, index: number) => (
                                                <span key={index} className="conf-detail-allocation-pill">
                                                    {allocation}
                                                </span>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* Awards */}
                                {conference.availableAwards.length > 0 && (() => {
                                    // Award metadata lookup
                                    const awardMeta: Record<string, { emoji: string; description: string; criteria: string; color: string }> = {
                                        'Best Delegate': { emoji: '👑', description: 'The highest individual honor recognizing exceptional diplomacy, leadership, and mastery of procedure.', criteria: 'Outstanding performance across all aspects — research, speaking, negotiation, and leadership.', color: '#f59e0b' },
                                        'Overall Best Delegate': { emoji: '👑', description: 'The top delegate across the entire conference, demonstrating excellence in every dimension of MUN.', criteria: 'Exceptional diplomacy, leadership, and procedural mastery across all sessions.', color: '#f59e0b' },
                                        'Best Overall Delegate': { emoji: '👑', description: 'The top delegate across the entire conference, demonstrating excellence in every dimension of MUN.', criteria: 'Exceptional diplomacy, leadership, and procedural mastery across all sessions.', color: '#f59e0b' },
                                        'Outstanding Delegate': { emoji: '🥇', description: 'Recognizes excellent performance and significant contributions to committee.', criteria: 'Strong research, effective speaking, and meaningful participation in resolution-building.', color: '#ef4444' },
                                        'Honorable Mention': { emoji: '🏅', description: 'Recognition for delegates who performed well and made notable contributions.', criteria: 'Good research, active participation, and collaborative approach.', color: '#22c55e' },
                                        'Honourable Mention': { emoji: '🏅', description: 'Recognition for delegates who performed well and made notable contributions.', criteria: 'Good research, active participation, and collaborative approach.', color: '#22c55e' },
                                        'Committee Best Delegate': { emoji: '🥇', description: 'The top delegate within a specific committee, excelling in debate and diplomacy.', criteria: 'Best overall performance within the committee — research, negotiation, and leadership.', color: '#f59e0b' },
                                        'Committee Honorable Mention': { emoji: '🏅', description: 'Notable performance within a specific committee session.', criteria: 'Active participation, constructive contributions, and strong collaborative spirit.', color: '#22c55e' },
                                        'Best Position Paper': { emoji: '✍️', description: 'Awarded for exceptional pre-conference research and writing.', criteria: 'Superior research, clear writing, and comprehensive topic understanding.', color: '#3b82f6' },
                                        'Best Overall Position Paper': { emoji: '✍️', description: 'The best position paper across the entire conference.', criteria: 'Outstanding research depth, clarity, and comprehensive policy analysis.', color: '#3b82f6' },
                                        'Committee Best Position Paper': { emoji: '✍️', description: 'Best position paper within a specific committee.', criteria: 'Strong research, clear writing, and relevant policy recommendations.', color: '#3b82f6' },
                                        'Best Chair': { emoji: '🎖️', description: 'Recognizes outstanding chairing — maintaining order, fairness, and engaging debate.', criteria: 'Procedural knowledge, impartiality, time management, and delegate engagement.', color: '#8b5cf6' },
                                        'Best Chairs': { emoji: '🎖️', description: 'Recognizes the best chairing team for maintaining excellent committee flow.', criteria: 'Procedural mastery, fair moderation, and fostering productive debate.', color: '#8b5cf6' },
                                        'Overall Best Chair': { emoji: '🎖️', description: 'The top chair across the entire conference.', criteria: 'Exceptional knowledge of procedure, fairness, and committee management.', color: '#8b5cf6' },
                                        'Honorable Chair': { emoji: '🏵️', description: 'Recognition for chairs who demonstrated strong skills and dedication.', criteria: 'Good procedural knowledge, effective moderation, and positive delegate experience.', color: '#a855f7' },
                                        'Honourable Chair': { emoji: '🏵️', description: 'Recognition for chairs who demonstrated strong skills and dedication.', criteria: 'Good procedural knowledge, effective moderation, and positive delegate experience.', color: '#a855f7' },
                                        'Honourable Mention for Chairs': { emoji: '🏵️', description: 'Special recognition for chairs who made notable contributions to their committee.', criteria: 'Effective moderation, helpfulness to delegates, and procedural competence.', color: '#a855f7' },
                                        'Best Committee': { emoji: '⭐', description: 'Awarded to the committee with the most productive and engaging sessions overall.', criteria: 'Quality of debate, collaboration, resolution outcomes, and delegate engagement.', color: '#06b6d4' },
                                    };

                                    const getAwardInfo = (name: string) => {
                                        // Direct match first
                                        if (awardMeta[name]) return awardMeta[name];
                                        // Try partial match for per-committee variants like "Best Delegate (per committee)"
                                        const baseName = name.replace(/\s*\(per committee\)/i, '').replace(/\s*\(2 per committee\)/i, '').trim();
                                        if (awardMeta[baseName]) return { ...awardMeta[baseName], description: awardMeta[baseName].description.replace('.', ' (awarded per committee).') };
                                        // Keyword fallback
                                        const lower = name.toLowerCase();
                                        if (lower.includes('best delegate')) return { ...awardMeta['Best Delegate'], description: `Recognizes the top-performing delegate. ${name}.` };
                                        if (lower.includes('honorable') || lower.includes('honourable')) return { emoji: '🏅', description: `Recognition for notable performance. ${name}.`, criteria: 'Active participation and collaborative approach.', color: '#22c55e' };
                                        if (lower.includes('position paper')) return { ...awardMeta['Best Position Paper'], description: `Awarded for exceptional research and writing. ${name}.` };
                                        if (lower.includes('chair')) return { emoji: '🎖️', description: `Recognizes outstanding chairing performance. ${name}.`, criteria: 'Procedural knowledge, fairness, and engagement.', color: '#8b5cf6' };
                                        return { emoji: '🏆', description: name, criteria: 'Demonstrated excellence in this category.', color: '#6b7280' };
                                    };

                                    return (
                                        <section className="conf-detail-awards-section">
                                            <h3 className="conf-detail-section-title">
                                                <i className="fas fa-trophy"></i> Awards
                                            </h3>
                                            <div className="conf-detail-awards-list">
                                                {conference.availableAwards.map((award: string, index: number) => {
                                                    const info = getAwardInfo(award);
                                                    return (
                                                        <div key={index} className="conf-detail-award-card" style={{ borderLeftColor: info.color }}>
                                                            <div className="conf-detail-award-header">
                                                                <span className="conf-detail-award-emoji">{info.emoji}</span>
                                                                <h4 className="conf-detail-award-name">{award}</h4>
                                                            </div>
                                                            <p className="conf-detail-award-desc">{info.description}</p>
                                                            <p className="conf-detail-award-criteria"><strong>Criteria:</strong> {info.criteria}</p>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </section>
                                    );
                                })()}

                                {/* Schedule & Venue */}
                                <div className="conf-detail-info-cards-row">
                                    <section className="conf-detail-info-card">
                                        <h3 className="conf-detail-section-title">
                                            <i className="fas fa-calendar-day"></i> Schedule
                                        </h3>
                                        <div className="conf-detail-card-content" dangerouslySetInnerHTML={{ __html: conference.schedule }}></div>
                                    </section>

                                    <section className="conf-detail-info-card">
                                        <h3 className="conf-detail-section-title">
                                            <i className="fas fa-building"></i> Venue &amp; Accessibility
                                        </h3>
                                        <div className="conf-detail-card-content">
                                            <div dangerouslySetInnerHTML={{ __html: conference.venueGuide }}></div>
                                            <div className="conf-detail-accessibility">
                                                <span className={conference.disabledSuitable ? 'accessible' : 'not-accessible'}>
                                                    {conference.disabledSuitable ? '♿ Wheelchair Accessible' : '⚠️ Contact for accessibility info'}
                                                </span>
                                                <span className={conference.sensorySuitable ? 'accessible' : 'not-accessible'}>
                                                    {conference.sensorySuitable ? '👁️ Sensory Friendly' : '⚠️ Not sensory-friendly'}
                                                </span>
                                            </div>
                                        </div>
                                    </section>
                                </div>

                                {/* Extra Notes */}
                                {conference.extraNotes && (
                                    <section className="conf-detail-extra-notes">
                                        <h3 className="conf-detail-section-title">
                                            <i className="fas fa-sticky-note"></i> Extra Notes
                                        </h3>
                                        <div className="conf-detail-notes-content" dangerouslySetInnerHTML={{ __html: conference.extraNotes }}></div>
                                    </section>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
