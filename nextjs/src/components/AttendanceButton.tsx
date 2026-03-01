'use client';

import { useState } from 'react';
import { toggleAttendance } from '@/lib/actions';

interface AttendanceButtonProps {
    conferenceId: number;
    initialStatus: 'saved' | 'attending' | 'not-attending';
}

export default function AttendanceButton({ conferenceId, initialStatus }: AttendanceButtonProps) {
    const [status, setStatus] = useState(initialStatus);
    const [loading, setLoading] = useState(false);

    const handleToggle = async (newStatus: 'saved' | 'attending' | 'not-attending') => {
        if (loading) return;
        setLoading(true);

        // Optimistic update
        const oldStatus = status;
        setStatus(newStatus);

        try {
            // If clicking the same status, toggle off (to not-attending)
            // Exception: if current is 'saved' and we click 'attending', we upgrade.
            // Logic:
            // - If currently 'not-attending' -> click 'saved' -> 'saved'
            // - If currently 'not-attending' -> click 'attending' -> 'attending'
            // - If currently 'saved' -> click 'saved' -> 'not-attending' (toggle off)
            // - If currently 'saved' -> click 'attending' -> 'attending' (upgrade)
            // - If currently 'attending' -> click 'attending' -> 'not-attending' (toggle off)
            // - If currently 'attending' -> click 'saved' -> 'saved'
            let targetStatus: 'saved' | 'attending' | 'not-attending' = newStatus;
            if (oldStatus === newStatus) {
                targetStatus = 'not-attending';
            }

            setStatus(targetStatus); // Update local state strictly
            const result = await toggleAttendance(conferenceId, targetStatus);

            if (!result || !result.success) {
                setStatus(oldStatus); // Revert
            }
        } catch (error) {
            setStatus(oldStatus); // Revert
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
            {/* Save Button */}
            <button
                onClick={() => handleToggle('saved')}
                disabled={loading}
                className="btn"
                style={{
                    backgroundColor: status === 'saved' ? '#f59e0b' : '#ffffff',
                    color: status === 'saved' ? '#ffffff' : '#475569',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    opacity: loading ? 0.7 : 1
                }}
            >
                <i className={`fas ${status === 'saved' ? 'fa-bookmark' : 'fa-bookmark'}`}></i>
                {status === 'saved' ? 'Saved' : 'Save'}
            </button>

            {/* Attend Button */}
            <button
                onClick={() => handleToggle('attending')}
                disabled={loading}
                className="btn"
                style={{
                    backgroundColor: status === 'attending' ? '#10b981' : '#ffffff',
                    color: status === 'attending' ? '#ffffff' : '#475569',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    opacity: loading ? 0.7 : 1
                }}
            >
                <i className={`fas ${status === 'attending' ? 'fa-check-circle' : 'fa-check-circle'}`}></i>
                {status === 'attending' ? 'Attending' : 'Attend'}
            </button>
        </div>
    );
}
