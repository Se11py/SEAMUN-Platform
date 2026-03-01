export default function ConferenceCardSkeleton() {
    return (
        <div className="conference-card skeleton-card" aria-hidden="true">
            <div className="skeleton-header">
                <div className="skeleton-line skeleton-title-line"></div>
                <div className="skeleton-line skeleton-subtitle-line"></div>
            </div>
            <div className="skeleton-body">
                <div className="skeleton-line skeleton-detail-line"></div>
                <div className="skeleton-line skeleton-detail-line"></div>
                <div className="skeleton-line skeleton-detail-line short"></div>
            </div>
            <div className="skeleton-footer">
                <div className="skeleton-pill"></div>
                <div className="skeleton-pill"></div>
            </div>
        </div>
    );
}
