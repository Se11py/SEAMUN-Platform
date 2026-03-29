'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export default function Navbar() {
    const [dateTime, setDateTime] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [schoolsMenuOpen, setSchoolsMenuOpen] = useState(false);
    const [delegatesMenuOpen, setDelegatesMenuOpen] = useState(false);
    const [resourcesMenuOpen, setResourcesMenuOpen] = useState(false);

    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            const options: Intl.DateTimeFormatOptions = {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            };
            setDateTime(now.toLocaleDateString('en-US', options));
        };
        updateDateTime();
        const interval = setInterval(updateDateTime, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <nav className="navbar" id="mainNavbar">
            <div className="navbar-container">
                {/* Brand */}
                <Link href="/" className="navbar-brand" aria-label="SEAMUNs - Home">
                    <Image
                        src="/assets/seamun-logo.jpg"
                        alt="SEAMUNS — Learn. Debate. Connect."
                        width={40}
                        height={40}
                        className="navbar-logo"
                    />
                    <span className="navbar-title">SEAMUNs</span>
                </Link>

                {/* Time Pill */}
                <div className="time-pill" id="timePill" style={{ display: dateTime ? 'flex' : 'none' }}>
                    <div className="time-icon">
                        <i className="fas fa-clock"></i>
                    </div>
                    <span id="dateTimeDisplay">{dateTime}</span>
                </div>

                {/* Navigation Links */}
                <div className={`navbar-links ${mobileMenuOpen ? 'active' : ''}`}>
                    {/* Schools & Advisors Dropdown */}
                    <div className="nav-item dropdown" onMouseEnter={() => setSchoolsMenuOpen(true)} onMouseLeave={() => setSchoolsMenuOpen(false)}>
                        <button
                            className="nav-link"
                            aria-expanded={schoolsMenuOpen}
                            aria-haspopup="true"
                            aria-label="Schools and Advisors menu"
                            onClick={() => setSchoolsMenuOpen(!schoolsMenuOpen)}
                        >
                            <i className="fas fa-school nav-main-icon" aria-hidden="true"></i>
                            <span>Schools &amp; Advisors</span>
                            <i className="fas fa-chevron-down" aria-hidden="true"></i>
                        </button>
                        <div className="dropdown-content">
                            <Link href="/participating-schools/">
                                <i className="fas fa-graduation-cap"></i> Participating Schools
                            </Link>
                            <Link href="/become-participating-school/">
                                <i className="fas fa-handshake"></i> How to Become a Participating School
                            </Link>
                            <Link href="/advisor-guide/">
                                <i className="fas fa-chalkboard-teacher"></i> Advisor Guide
                            </Link>
                        </div>
                    </div>

                    {/* Delegates & Chairs Dropdown */}
                    <div className="nav-item dropdown" onMouseEnter={() => setDelegatesMenuOpen(true)} onMouseLeave={() => setDelegatesMenuOpen(false)}>
                        <button
                            className="nav-link"
                            aria-expanded={delegatesMenuOpen}
                            aria-haspopup="true"
                            aria-label="Delegates and Chairs menu"
                            onClick={() => setDelegatesMenuOpen(!delegatesMenuOpen)}
                        >
                            <i className="fas fa-users nav-main-icon" aria-hidden="true"></i>
                            <span>Delegates &amp; Chairs</span>
                            <i className="fas fa-chevron-down" aria-hidden="true"></i>
                        </button>
                        <div className="dropdown-content">
                            <div className="dropdown-group-label" style={{ padding: '8px 16px 4px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>Getting Started</div>
                            <Link href="/mun-guide/">
                                <i className="fas fa-book"></i> MUN Guide
                            </Link>
                            <Link href="/delegate-signup/">
                                <i className="fas fa-user-plus"></i> How to Sign Up
                            </Link>
                            <Link href="/individual-delegates/">
                                <i className="fas fa-user"></i> Individual Delegates
                            </Link>

                            <div className="dropdown-divider" style={{ height: '1px', background: 'var(--separator)', margin: '4px 0' }}></div>
                            <div className="dropdown-group-label" style={{ padding: '8px 16px 4px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>Preparation</div>
                            <Link href="/how-to-prep/">
                                <i className="fas fa-clipboard-list"></i> How to Prep
                            </Link>
                            <Link href="/confidence/">
                                <i className="fas fa-heart"></i> Confidence Building
                            </Link>
                            <Link href="/chair-guide/">
                                <i className="fas fa-gavel"></i> Chair Guide
                            </Link>

                            <div className="dropdown-divider" style={{ height: '1px', background: 'var(--separator)', margin: '4px 0' }}></div>
                            <div className="dropdown-group-label" style={{ padding: '8px 16px 4px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>At the Conference</div>
                            <Link href="/stand-out/">
                                <i className="fas fa-star"></i> How to Stand Out
                            </Link>
                            <Link href="/support/">
                                <i className="fas fa-hands-helping"></i> Support at Conferences
                            </Link>
                        </div>
                    </div>

                    {/* Resources Dropdown */}
                    <div className="nav-item dropdown" onMouseEnter={() => setResourcesMenuOpen(true)} onMouseLeave={() => setResourcesMenuOpen(false)}>
                        <button
                            className="nav-link"
                            aria-expanded={resourcesMenuOpen}
                            aria-haspopup="true"
                            aria-label="Resources menu"
                            onClick={() => setResourcesMenuOpen(!resourcesMenuOpen)}
                        >
                            <i className="fas fa-book nav-main-icon" aria-hidden="true"></i>
                            <span>Resources</span>
                            <i className="fas fa-chevron-down" aria-hidden="true"></i>
                        </button>
                        <div className="dropdown-content">
                            <Link href="/position-papers/">
                                <i className="fas fa-file-word"></i> Position Papers
                            </Link>
                            <Link href="/resolutions/">
                                <i className="fas fa-file-alt"></i> Resolutions
                            </Link>
                            <Link href="/speeches/">
                                <i className="fas fa-microphone"></i> Speeches
                            </Link>
                            <Link href="/committees/">
                                <i className="fas fa-users-cog"></i> Committees
                            </Link>
                            <Link href="/templates/">
                                <i className="fas fa-file-download"></i> Templates
                            </Link>
                            <Link href="/munsimulation/" target="_blank" rel="noopener noreferrer">
                                <i className="fas fa-gamepad"></i> MUN Simulation Game
                            </Link>
                            <div className="dropdown-divider" style={{ height: '1px', background: 'var(--separator)', margin: '4px 0' }}></div>
                            <Link href="/resources/" style={{ fontWeight: 600, color: 'var(--primary)', justifyContent: 'center', background: 'var(--bg-tertiary)' }}>
                                View All Resources <i className="fas fa-arrow-right" style={{ marginLeft: '6px', fontSize: '13px' }}></i>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Auth / User Actions */}
                <div className="navbar-actions">
                    {/* Clerk Auth */}
                    <SignedOut>
                        <div className="auth-buttons compact">
                            <Link href="/sign-in" className="btn btn-secondary btn-sm">Login</Link>
                            <Link href="/sign-up" className="btn btn-primary btn-sm">Sign Up</Link>
                        </div>
                    </SignedOut>
                    <SignedIn>
                        <div className="auth-buttons compact" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Link href="/profile" className="btn btn-secondary btn-sm">
                                <i className="fas fa-user"></i> Profile
                            </Link>
                            <UserButton
                                afterSignOutUrl="/"
                                appearance={{
                                    elements: {
                                        avatarBox: { width: 36, height: 36 },
                                    },
                                }}
                            />
                        </div>
                    </SignedIn>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="mobile-menu-toggle"
                        id="mobileMenuBtn"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle navigation menu"
                        aria-expanded={mobileMenuOpen}
                    >
                        <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`} aria-hidden="true"></i>
                    </button>
                </div>
            </div>
        </nav>
    );
}
