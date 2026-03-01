import ContentPage from '@/components/ContentPage';

export default function ProspectiveMunsPage() {
    return (
        <ContentPage title="⏳ Prospective MUNs">
            <p className="text-secondary" style={{ marginBottom: '2rem', lineHeight: '1.6' }}>
                Conferences that may be added to the calendar once details are confirmed. None listed at the moment.
            </p>

            <div className="conference-list" aria-live="polite">
                {/* Fallback state when no prospective MUNs are available via dynamic JS. */}
                <p className="text-secondary">No prospective conferences listed.</p>
            </div>
        </ContentPage>
    );
}
