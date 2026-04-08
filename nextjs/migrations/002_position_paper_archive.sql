-- Migration 002: Position Paper Archive
-- Created: 2026-04-06
-- Description: Community-submitted position paper archive with optional award tags

CREATE TABLE IF NOT EXISTS position_papers (
    paper_id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    committee_name TEXT,
    conference_name TEXT,
    topic TEXT,
    -- Either a link (Google Doc / direct PDF URL) OR file_data (base64-encoded upload)
    link TEXT,
    file_data TEXT,
    file_name TEXT,
    file_type TEXT,
    best_paper_tag TEXT CHECK (best_paper_tag IN ('committee', 'overall', 'none')) DEFAULT 'none',
    own_work_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_position_papers_user ON position_papers(user_id);
CREATE INDEX IF NOT EXISTS idx_position_papers_tag ON position_papers(best_paper_tag);
CREATE INDEX IF NOT EXISTS idx_position_papers_created ON position_papers(created_at DESC);
