import Link from 'next/link';

interface EmptyStateProps {
    title?: string;
    message?: string;
    iconClass?: string;
    actionLabel?: string | undefined;
    onAction?: () => void;
    actionHref?: string;
}

export default function EmptyState({
    title = "No results found",
    message = "We couldn't find anything matching your criteria.",
    iconClass = "fas fa-search",
    actionLabel,
    onAction,
    actionHref
}: EmptyStateProps) {
    return (
        <div className="empty-state">
            <div className="empty-state-icon">
                <i className={iconClass}></i>
            </div>
            <h3>{title}</h3>
            <p>{message}</p>

            {(actionLabel && (onAction || actionHref)) && (
                <div className="empty-state-actions">
                    {actionHref ? (
                        <Link href={actionHref} className="button secondary empty-state-btn">
                            {actionLabel}
                        </Link>
                    ) : (
                        <button onClick={onAction} className="button secondary empty-state-btn">
                            {actionLabel}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
