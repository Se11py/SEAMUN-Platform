'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Image from 'next/image';
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

      {/* Hero Banner */}
      <div className="hero-banner-container">
        <Image
          src="/assets/mun-banner.jpeg"
          alt="Model United Nations - Diplomacy in Art"
          fill
          className="hero-banner-image"
          priority
        />
        <a href="#main-content" className="scroll-indicator" aria-label="Scroll down">
          <i className="fas fa-chevron-down"></i>
        </a>
      </div>

      {/* Main Tabs */}
      <div className="main-tabs-container">
        <div className="main-tabs" ref={mainTabContainerRef}>
          <div
            className="main-tab-slider"
            style={{
              left: mainTabSliderStyle.left,
              width: mainTabSliderStyle.width,
            }}
          />
          <button
            ref={(el) => { if (el) mainTabButtonRefs.current.set('conferences', el); }}
            className={`main-tab-btn ${activeMainTab === 'conferences' ? 'active' : ''}`}
            data-main-tab="conferences"
            onClick={() => setActiveMainTab('conferences')}
          >
            <i className="fas fa-globe-americas"></i>
            <span className="font-clash text-xl">Track Conferences</span>
          </button>
          <button
            ref={(el) => { if (el) mainTabButtonRefs.current.set('simulation', el); }}
            className={`main-tab-btn ${activeMainTab === 'simulation' ? 'active' : ''}`}
            data-main-tab="simulation"
            onClick={() => setActiveMainTab('simulation')}
          >
            <i className="fas fa-gamepad"></i>
            <span className="font-clash text-xl">MUN Simulation</span>
          </button>
        </div>
      </div>

      {/* Sub-navbar Tagline — only on Conferences tab */}
      {activeMainTab === 'conferences' && (
        <div className="sub-navbar-tagline">
          Track upcoming and previous Model United Nations<br />conferences across South East Asia 🌏
        </div>
      )}

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
              <div className="try-it-out-card">
                <div className="try-it-out-content">
                  <div className="try-it-out-icon">
                    <i className="fas fa-gamepad"></i>
                  </div>
                  <h2>Ready to Practice?</h2>
                  <p>Experience a single-player MUN procedure simulator. Practice your debate skills, learn parliamentary procedure, and build confidence before your next conference.</p>
                  <div className="try-it-out-features">
                    <span><i className="fas fa-user"></i> Delegate Mode</span>
                    <span><i className="fas fa-gavel"></i> Chair's Role</span>
                    <span><i className="fas fa-trophy"></i> Earn Points</span>
                  </div>
                  <a href="/munsimulation" className="btn btn-primary btn-large" target="_blank" rel="noopener noreferrer">
                    <i className="fas fa-play"></i> Start Simulation
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
