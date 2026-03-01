import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="not-found-page">
            <div className="not-found-content">
                <div className="not-found-code">404</div>
                <h1>Page Not Found</h1>
                <p>
                    Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>

                <Link href="/" className="not-found-cta">
                    <i className="fas fa-home" aria-hidden="true"></i>
                    Go Home
                </Link>

                <div className="not-found-suggestions">
                    <h2>Try these instead</h2>
                    <div className="not-found-links">
                        <Link href="/munsimulation">
                            <i className="fas fa-gamepad" aria-hidden="true"></i>
                            <span>MUN Simulation</span>
                        </Link>
                        <Link href="/delegate-signup">
                            <i className="fas fa-user-plus" aria-hidden="true"></i>
                            <span>Delegate Guide</span>
                        </Link>
                        <Link href="/mun-guide">
                            <i className="fas fa-book" aria-hidden="true"></i>
                            <span>MUN Guide</span>
                        </Link>
                        <Link href="/committees">
                            <i className="fas fa-users-cog" aria-hidden="true"></i>
                            <span>Committees</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
