'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ConferenceCard from '@/components/ConferenceCard';
import ConferenceCardSkeleton from '@/components/ConferenceCardSkeleton';
import EmptyState from '@/components/EmptyState';
import { Conference, getConferenceStatus, withDerivedConferenceStatus } from '@/lib/conferences-data';

const TAB_KEYS = ['all', 'upcoming', 'previous', 'attending', 'attended'] as const;
type TabKey = typeof TAB_KEYS[number];

const MAIN_TAB_KEYS = ['conferences', 'simulation'] as const;
type MainTabKey = typeof MAIN_TAB_KEYS[number];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [activeMainTab, setActiveMainTab] = useState<MainTabKey>('conferences');
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Map<TabKey, HTMLButtonElement>>(new Map());
  const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0 });
  const [attendanceMap, setAttendanceMap] = useState<Record<number, 'saved' | 'attending' | 'not-attending'>>({});
  const [loading, setLoading] = useState(true);
  const [conferences, setConferences] = useState<Conference[]>([]);

  // Main Tab Slider State
  const [mainTabSliderStyle, setMainTabSliderStyle] = useState({ left: 0, width: 0 });
  const mainTabContainerRef = useRef<HTMLDivElement>(null);
  const mainTabButtonRefs = useRef<Map<MainTabKey, HTMLButtonElement>>(new Map());

  // Import locally to avoid server/client issues
  const { getTrackedConferences } = require('@/lib/actions');

  // Fetch data (Conferences + Attendance)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [conferencesData, tracked] = await Promise.all([
          fetch('/api/conferences').then(res => {
            if (!res.ok) throw new Error('Failed to fetch conferences');
            return res.json();
          }),
          getTrackedConferences().catch((err: any) => {
            console.error('Failed to fetch attendance:', err);
            return [];
          })
        ]);

        setConferences(conferencesData.map(withDerivedConferenceStatus));

        const map: Record<number, 'saved' | 'attending' | 'not-attending'> = {};
        if (tracked && Array.isArray(tracked)) {
          tracked.forEach((t: any) => {
            map[t.conference_id] = t.attendance_status;
          });
        }
        setAttendanceMap(map);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Update main tab slider position
  useEffect(() => {
    const button = mainTabButtonRefs.current.get(activeMainTab);
    const container = mainTabContainerRef.current;
    if (button && container) {
      const containerRect = container.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      setMainTabSliderStyle({
        left: buttonRect.left - containerRect.left,
        width: buttonRect.width,
      });
    }
  }, [activeMainTab]);

  // Force icon color with !important (needed to override global .fas rule)
  useEffect(() => {
    mainTabButtonRefs.current.forEach((btn, key) => {
      const icon = btn.querySelector('i');
      if (icon) {
        if (key === activeMainTab) {
          (icon as HTMLElement).style.setProperty('color', '#ffffff', 'important');
        } else {
          (icon as HTMLElement).style.removeProperty('color');
        }
      }
    });
  }, [activeMainTab]);

  // Initial main tab position on mount
  useEffect(() => {
    let raf: number;
    const updateSlider = () => {
      const button = mainTabButtonRefs.current.get(activeMainTab);
      const container = mainTabContainerRef.current;
      if (button && container) {
        const containerRect = container.getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();
        setMainTabSliderStyle({
          left: buttonRect.left - containerRect.left,
          width: buttonRect.width,
        });
      }
    };
    raf = requestAnimationFrame(updateSlider);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Update slider position when active tab changes
  useEffect(() => {
    const button = buttonRefs.current.get(activeTab);
    const container = containerRef.current;
    if (button && container) {
      const containerRect = container.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      setSliderStyle({
        left: buttonRect.left - containerRect.left,
        width: buttonRect.width,
      });
    }
  }, [activeTab]);

  // Initial position on mount
  useEffect(() => {
    let raf: number;
    const updateSlider = () => {
      const button = buttonRefs.current.get(activeTab);
      const container = containerRef.current;
      if (button && container) {
        const containerRect = container.getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();
        setSliderStyle({
          left: buttonRect.left - containerRect.left,
          width: buttonRect.width,
        });
      }
    };
    raf = requestAnimationFrame(updateSlider);
    return () => cancelAnimationFrame(raf);
  }, []);

  const locations = useMemo(() => {
    const locs = new Set<string>();
    conferences.forEach(conf => locs.add(conf.location));
    return Array.from(locs).sort();
  }, [conferences]);



  const filteredConferences = useMemo(() => {
    return conferences.filter(conf => {
      const status = getConferenceStatus(conf);

      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery ||
        conf.name.toLowerCase().includes(searchLower) ||
        conf.organization.toLowerCase().includes(searchLower) ||
        conf.location.toLowerCase().includes(searchLower);

      // Status filter
      const matchesStatus = statusFilter === 'all' || status === statusFilter;

      // Location filter
      const matchesLocation = locationFilter === 'all' || conf.location === locationFilter;

      // Tab filter
      let matchesTab = true;
      if (activeTab === 'upcoming') matchesTab = status === 'upcoming';
      if (activeTab === 'previous') matchesTab = status === 'previous';
      if (activeTab === 'attending') matchesTab = attendanceMap[conf.id] === 'attending';
      if (activeTab === 'attended') matchesTab = attendanceMap[conf.id] === 'attending' && status === 'previous';

      return matchesSearch && matchesStatus && matchesLocation && matchesTab;
    });
  }, [searchQuery, statusFilter, locationFilter, activeTab, attendanceMap]);

  const upcomingCount = conferences.filter(c => getConferenceStatus(c) === 'upcoming').length;
  const previousCount = conferences.filter(c => getConferenceStatus(c) === 'previous').length;
  const totalCount = conferences.length;
  const attendingCount = conferences.filter(c => attendanceMap[c.id] === 'attending').length;
  const attendedCount = conferences.filter(c => attendanceMap[c.id] === 'attending' && getConferenceStatus(c) === 'previous').length;

  return (
    <>
      <Navbar />

      {/* Page Intro + Main Tabs */}
      <div className="main-tabs-container">
        <div className="main-page-intro">
          <p className="main-page-eyebrow">South East Asia</p>
          <h1 className="main-page-title">Model United Nations Network</h1>
          <p className="main-page-subtitle">Track upcoming &amp; past conferences, practise debate skills, and connect with MUN communities across the region.</p>
        </div>
        <div className="main-tabs-row">
          <div className="main-tabs" ref={mainTabContainerRef}>
            <div className="main-tab-slider" style={{ left: mainTabSliderStyle.left, width: mainTabSliderStyle.width }} />
            <button
              ref={(el) => { if (el) mainTabButtonRefs.current.set('conferences', el); }}
              className={`main-tab-btn ${activeMainTab === 'conferences' ? 'active' : ''}`}
              data-main-tab="conferences"
              onClick={() => setActiveMainTab('conferences')}
            >
              <i className="fas fa-globe-americas"></i>
              <span>Track Conferences</span>
            </button>
            <button
              ref={(el) => { if (el) mainTabButtonRefs.current.set('simulation', el); }}
              className={`main-tab-btn ${activeMainTab === 'simulation' ? 'active' : ''}`}
              data-main-tab="simulation"
              onClick={() => setActiveMainTab('simulation')}
            >
              <i className="fas fa-gamepad"></i>
              <span>MUN Simulation</span>
            </button>
          </div>
        </div>
      </div>

      <main className="main" id="main-content">
        <div className="container">
          {/* Tab Content: Conferences */}
          <div id="conferencesTab" className={`main-tab-content ${activeMainTab === 'conferences' ? 'active' : ''}`}>
            {/* Controls Section */}
            <section className="controls">
              <div className="search-bar">
                <i className="fas fa-search"></i>
                <label htmlFor="searchInput" className="sr-only">Search conferences</label>
                <input
                  type="text"
                  id="searchInput"
                  placeholder="Search conferences by name, location, or organization..."
                  aria-label="Search conferences"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="filters">
                <label htmlFor="statusFilter" className="sr-only">Filter by status</label>
                <select
                  id="statusFilter"
                  aria-label="Filter conferences by status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">🌐 All Conferences</option>
                  <option value="upcoming">📅 Upcoming</option>
                  <option value="previous">📜 Previous</option>
                </select>

                <label htmlFor="locationFilter" className="sr-only">Filter by location</label>
                <select
                  id="locationFilter"
                  aria-label="Filter conferences by location"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                >
                  <option value="all">All Locations</option>
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </section>

            {/* Statistics Section */}
            <section className="stats">
              <div className="stat-card">
                <div className="stat-icon upcoming">
                  <i className="fas fa-calendar-plus"></i>
                </div>
                <div className="stat-content">
                  <h3 id="upcomingCount">{upcomingCount}</h3>
                  <p>📅 Upcoming</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon previous">
                  <i className="fas fa-history"></i>
                </div>
                <div className="stat-content">
                  <h3 id="previousCount">{previousCount}</h3>
                  <p>📜 Previous</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon total">
                  <i className="fas fa-globe-americas"></i>
                </div>
                <div className="stat-content">
                  <h3 id="totalCount">{totalCount}</h3>
                  <p>🌐 Total</p>
                </div>
              </div>
            </section>

            {/* Stats Bar / Tabs */}
            <section className="stats-bar">
              <div className="tab-container" ref={containerRef}>
                {/* Sliding background */}
                <div
                  className="tab-slider"
                  style={{
                    left: sliderStyle.left,
                    width: sliderStyle.width,
                  }}
                />
                <button
                  ref={(el) => { if (el) buttonRefs.current.set('all', el); }}
                  className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                  data-tab="all"
                  onClick={() => setActiveTab('all')}
                >
                  <i className="fas fa-check-circle"></i>
                  <span>All Registered MUNs</span>
                  <div className="tab-count">{totalCount}</div>
                </button>
                <button
                  ref={(el) => { if (el) buttonRefs.current.set('upcoming', el); }}
                  className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
                  data-tab="upcoming"
                  onClick={() => setActiveTab('upcoming')}
                >
                  <i className="fas fa-calendar-plus"></i>
                  <span>Upcoming</span>
                  <div className="tab-count">{upcomingCount}</div>
                </button>
                <button
                  ref={(el) => { if (el) buttonRefs.current.set('previous', el); }}
                  className={`tab-btn ${activeTab === 'previous' ? 'active' : ''}`}
                  data-tab="previous"
                  onClick={() => setActiveTab('previous')}
                >
                  <i className="fas fa-history"></i>
                  <span>Previous</span>
                  <div className="tab-count">{previousCount}</div>
                </button>
                <button
                  ref={(el) => { if (el) buttonRefs.current.set('attending', el); }}
                  className={`tab-btn ${activeTab === 'attending' ? 'active' : ''}`}
                  data-tab="attending"
                  onClick={() => setActiveTab('attending')}
                >
                  <i className="fas fa-user-check"></i>
                  <span>Attending</span>
                  <div className="tab-count">{attendingCount}</div>
                </button>
                <button
                  ref={(el) => { if (el) buttonRefs.current.set('attended', el); }}
                  className={`tab-btn ${activeTab === 'attended' ? 'active' : ''}`}
                  data-tab="attended"
                  onClick={() => setActiveTab('attended')}
                >
                  <i className="fas fa-trophy"></i>
                  <span>Attended</span>
                  <div className="tab-count">{attendedCount}</div>
                </button>
              </div>
            </section>

            {/* Conferences List */}
            <section className="conferences">
              <div id="conferencesList" className="conferences-grid" style={{ minHeight: '800px' }}>
                {loading ? (
                  <>
                    <ConferenceCardSkeleton />
                    <ConferenceCardSkeleton />
                    <ConferenceCardSkeleton />
                  </>
                ) : filteredConferences.length > 0 ? (
                  filteredConferences.map(conference => (
                    <ConferenceCard
                      key={conference.id}
                      conference={conference}
                      attendanceStatus={attendanceMap[conference.id]}
                    />
                  ))
                ) : (
                  <EmptyState
                    title="No conferences found"
                    message="We couldn't find any conferences matching your criteria. Try adjusting your search or filters."
                    actionLabel={(searchQuery || statusFilter !== 'all' || locationFilter !== 'all' || activeTab !== 'all') ? "Clear Filters" : undefined}
                    onAction={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                      setLocationFilter('all');
                      setActiveTab('all');
                    }}
                  />
                )}
              </div>
            </section>
          </div>

          {/* Tab Content: Simulation */}
          <div id="simulationTab" className={`main-tab-content ${activeMainTab === 'simulation' ? 'active' : ''}`}>
            {/* Try It Out Section */}
            <section className="try-it-out">
              <div className="tio-inner">
                {/* Left — dark decorative panel */}
                <div className="tio-visual" aria-hidden="true">
                  <div className="tio-visual-ornament">
                    <svg viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Globe */}
                      <circle cx="140" cy="140" r="100" stroke="#C9A227" strokeWidth="5" strokeOpacity="0.7"/>
                      <circle cx="140" cy="140" r="72" stroke="#C9A227" strokeWidth="2.5" strokeOpacity="0.4"/>
                      <ellipse cx="140" cy="140" rx="100" ry="42" stroke="#C9A227" strokeWidth="2.5" strokeOpacity="0.45"/>
                      <ellipse cx="140" cy="140" rx="100" ry="68" stroke="#C9A227" strokeWidth="2" strokeOpacity="0.3"/>
                      <ellipse cx="140" cy="140" rx="44" ry="100" stroke="#C9A227" strokeWidth="2" strokeOpacity="0.35"/>
                      <line x1="40" y1="140" x2="240" y2="140" stroke="#C9A227" strokeWidth="2" strokeOpacity="0.35"/>
                      <line x1="140" y1="40" x2="140" y2="240" stroke="#C9A227" strokeWidth="2" strokeOpacity="0.35"/>
                      {/* Gavel */}
                      <rect x="148" y="72" width="44" height="20" rx="4" fill="#C9A227" fillOpacity="0.82" transform="rotate(45 148 72)"/>
                      <rect x="108" y="110" width="16" height="64" rx="4" fill="#C9A227" fillOpacity="0.6" transform="rotate(45 108 110)"/>
                    </svg>
                  </div>
                  <div className="tio-visual-label">MUN Simulation</div>
                  <div className="tio-visual-rule">
                    <span/><i className="fas fa-star"/><span/>
                  </div>
                  <p className="tio-visual-sub">Single-player practice mode</p>
                </div>

                {/* Right — content */}
                <div className="tio-content">
                  <p className="tio-eyebrow">Try It Out</p>
                  <h2 className="tio-headline">Practice Before<br/>the Real Thing</h2>
                  <p className="tio-body">Experience a single-player MUN procedure simulator. Build your debate skills, master parliamentary procedure, and walk into your next conference with confidence.</p>

                  <div className="tio-features">
                    <div className="tio-feature">
                      <div className="tio-feature-icon"><i className="fas fa-user"/></div>
                      <div>
                        <strong>Delegate Mode</strong>
                        <span>Practice floor debate &amp; motions</span>
                      </div>
                    </div>
                    <div className="tio-feature">
                      <div className="tio-feature-icon"><i className="fas fa-gavel"/></div>
                      <div>
                        <strong>Chair's Role</strong>
                        <span>Run a committee session</span>
                      </div>
                    </div>
                    <div className="tio-feature">
                      <div className="tio-feature-icon"><i className="fas fa-trophy"/></div>
                      <div>
                        <strong>Earn Points</strong>
                        <span>Track your progress</span>
                      </div>
                    </div>
                  </div>

                  <a href="/munsimulation" className="tio-cta" target="_blank" rel="noopener noreferrer">
                    Start Simulation <i className="fas fa-arrow-right"/>
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
