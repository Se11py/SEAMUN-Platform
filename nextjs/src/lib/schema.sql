-- SEAMUNs Database Schema (PostgreSQL/Neon)
-- Created: 2026

-- ============================================
-- CLEANUP (Drop existing tables)
-- ============================================
DROP TABLE IF EXISTS feedback CASCADE;
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS awards CASCADE;
DROP TABLE IF EXISTS committees CASCADE;
DROP TABLE IF EXISTS allocations CASCADE;
DROP TABLE IF EXISTS available_awards CASCADE;
DROP TABLE IF EXISTS previous_winners CASCADE;
DROP TABLE IF EXISTS unique_topics CASCADE;
DROP TABLE IF EXISTS conferences CASCADE;
DROP TABLE IF EXISTS user_conferences CASCADE; -- Legacy table
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    user_id TEXT PRIMARY KEY, -- Clerk User ID
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    pronouns TEXT,
    profile_picture TEXT,
    banner TEXT,
    auth_provider TEXT DEFAULT 'email',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- CONFERENCES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS conferences (
    conference_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    organization TEXT,
    location TEXT,
    country_code CHAR(2),
    start_date DATE,
    end_date DATE,
    description TEXT,
    website TEXT,
    registration_deadline DATE,
    position_paper_deadline DATE,
    status TEXT CHECK (status IN ('upcoming', 'ongoing', 'past', 'previous')) DEFAULT 'upcoming',
    size TEXT,
    general_email TEXT,
    mun_account TEXT,
    advisor_account TEXT,
    sec_gen_accounts TEXT,
    parliamentarian_accounts TEXT,
    price_per_delegate TEXT,
    independent_dels_welcome BOOLEAN DEFAULT FALSE,
    independent_signup_link TEXT,
    advisor_signup_link TEXT,
    disabled_suitable BOOLEAN DEFAULT FALSE,
    sensory_suitable BOOLEAN DEFAULT FALSE,
    schedule TEXT,
    venue_guide TEXT,
    extra_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_conferences_status ON conferences(status);
CREATE INDEX IF NOT EXISTS idx_conferences_start_date ON conferences(start_date);
CREATE INDEX IF NOT EXISTS idx_conferences_location ON conferences(location);

-- ============================================
-- COMMITTEES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS committees (
    committee_id SERIAL PRIMARY KEY,
    conference_id INT NOT NULL REFERENCES conferences(conference_id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    topic TEXT,
    chair_info TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_committees_conference ON committees(conference_id);

-- ============================================
-- AWARDS TABLE (Earned by users)
-- ============================================
CREATE TABLE IF NOT EXISTS awards (
    award_id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    conference_id INT NOT NULL REFERENCES conferences(conference_id) ON DELETE CASCADE,
    award_type TEXT NOT NULL,
    committee TEXT,
    country TEXT,
    award_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_awards_user ON awards(user_id);
CREATE INDEX IF NOT EXISTS idx_awards_conference ON awards(conference_id);

-- ============================================
-- ATTENDANCE TABLE (User tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS attendance (
    attendance_id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    conference_id INT NOT NULL REFERENCES conferences(conference_id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('not-attending', 'attending', 'attended', 'saved')) DEFAULT 'not-attending',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, conference_id)
);

CREATE INDEX IF NOT EXISTS idx_attendance_user ON attendance(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_conference ON attendance(conference_id);
CREATE INDEX IF NOT EXISTS idx_attendance_status ON attendance(status);

-- ============================================
-- FEEDBACK TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS feedback (
    feedback_id SERIAL PRIMARY KEY,
    conference_id INT NOT NULL REFERENCES conferences(conference_id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT NOT NULL,
    comment TEXT NOT NULL,
    recommend BOOLEAN DEFAULT FALSE,
    highlights TEXT,
    improvements TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, conference_id)
);

CREATE INDEX IF NOT EXISTS idx_feedback_conference ON feedback(conference_id);
CREATE INDEX IF NOT EXISTS idx_feedback_user ON feedback(user_id);

-- ============================================
-- ALLOCATIONS TABLE (Country assignments)
-- ============================================
CREATE TABLE IF NOT EXISTS allocations (
    allocation_id SERIAL PRIMARY KEY,
    conference_id INT NOT NULL REFERENCES conferences(conference_id) ON DELETE CASCADE,
    country TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_allocations_conference ON allocations(conference_id);

-- ============================================
-- AVAILABLE AWARDS TABLE (Offered by conf)
-- ============================================
CREATE TABLE IF NOT EXISTS available_awards (
    available_award_id SERIAL PRIMARY KEY,
    conference_id INT NOT NULL REFERENCES conferences(conference_id) ON DELETE CASCADE,
    award_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_available_awards_conference ON available_awards(conference_id);

-- ============================================
-- PREVIOUS WINNERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS previous_winners (
    winner_id SERIAL PRIMARY KEY,
    conference_id INT NOT NULL REFERENCES conferences(conference_id) ON DELETE CASCADE,
    winner_name TEXT NOT NULL,
    award_type TEXT,
    year INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_previous_winners_conference ON previous_winners(conference_id);

-- ============================================
-- UNIQUE TOPICS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS unique_topics (
    topic_id SERIAL PRIMARY KEY,
    conference_id INT NOT NULL REFERENCES conferences(conference_id) ON DELETE CASCADE,
    topic TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_unique_topics_conference ON unique_topics(conference_id);
