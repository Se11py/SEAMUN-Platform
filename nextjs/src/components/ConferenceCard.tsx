'use client';

import Link from 'next/link';
import { Conference } from '@/lib/conferences-data';

export interface ConferenceCardProps {
    conference: Conference;
    attendanceStatus?: 'saved' | 'attending' | 'not-attending' | undefined;
}

export default function ConferenceCard({ conference, attendanceStatus }: ConferenceCardProps) {
    const formatDate = (dateStr: string | null | undefined) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
    };

    const formatDateRange = (startDate: string | null | undefined, endDate: string | null | undefined) => {
        if (!startDate) return '';
        const start = formatDate(startDate);
        if (!endDate || startDate === endDate) return start;
        return `${start} - ${formatDate(endDate)}`;
    };

    return (
        <Link href={`/conference/${conference.id}/`} className="conference-card-link">
            <div className={`conference-card ${conference.status}`}>
                {/* Header: Title + Badges */}
                <div className="conference-header">
                    <h3 className="conference-title">{conference.name}</h3>
                    <div className="status-badges">
                        <span className={`conference-status ${conference.status}`}>
                            {conference.status === 'upcoming' ? 'UPCOMING' : 'PREVIOUS'}
                        </span>
                        {attendanceStatus === 'attending' && (
                            <span className="attendance-status attending">
                                <i className="fas fa-check-circle"></i>
                                ATTENDING
                            </span>
                        )}
                        {attendanceStatus === 'saved' && (
                            <span className="attendance-status saved" style={{ background: '#fffbeb', color: '#d97706', borderColor: '#fcd34d' }}>
                                <i className="fas fa-bookmark"></i>
                                SAVED
                            </span>
                        )}
                        {(!attendanceStatus || attendanceStatus === 'not-attending') && (
                            <span className="attendance-status not-attending">
                                <i className="fas fa-chess-board"></i>
                                NOT ATTENDING
                            </span>
                        )}
                    </div>
                </div>

                {/* Info Items */}
                <div className="conference-info">
                    <div className="conference-info-item">
                        <i className="fas fa-landmark"></i>
                        <span>{conference.organization}</span>
                    </div>
                    <div className="conference-info-item">
                        <i className="fas fa-map-marker-alt" aria-hidden="true"></i>
                        <span>
                            {conference.countryCode === 'TH' ? (
                                <span role="img" aria-label="Thailand Flag">🇹🇭 </span>
                            ) : ''}
                            {conference.location}
                        </span>
                    </div>
                    <div className="conference-info-item">
                        <i className="fas fa-calendar-alt"></i>
                        <span>{formatDateRange(conference.startDate, conference.endDate)}</span>
                    </div>
                    {conference.registrationDeadline && (
                        <div className="conference-info-item">
                            <i className="fas fa-clock"></i>
                            <span>Registration: {formatDate(conference.registrationDeadline)}</span>
                        </div>
                    )}
                </div>

                {/* Description */}
                <p className="conference-description">{conference.description}</p>

                {/* CTA Button */}
                <div className="conference-actions">
                    <span className="btn">
                        Join the Action &nbsp; →
                    </span>
                </div>
            </div>
        </Link>
    );
}
