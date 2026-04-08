'use client';

import { useState, useTransition, useEffect, useRef } from 'react';
import { submitPositionPaper, updatePositionPaper, deletePositionPaper, type PositionPaper } from '@/lib/position-paper-actions';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isGoogleDocsLink(url: string): boolean {
    return url.includes('docs.google.com') || url.includes('drive.google.com/file');
}

function toGoogleDocsEmbedUrl(url: string): string {
    if (url.includes('docs.google.com/document')) {
        return url.replace('/edit', '/preview').replace(/[?#].*$/, '') + '?embedded=true';
    }
    if (url.includes('drive.google.com/file/d/')) {
        const match = url.match(/\/file\/d\/([^/]+)/);
        if (match) return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
    return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
}

// ─── Paper Form ───────────────────────────────────────────────────────────────

interface PaperFormProps {
    existing?: PositionPaper | undefined;
    onCancel: () => void;
    onSuccess: () => void;
}

function PaperForm({ existing, onCancel, onSuccess }: PaperFormProps) {
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        const formData = new FormData(e.currentTarget);
        startTransition(async () => {
            const result = existing
                ? await updatePositionPaper(existing.paper_id, formData)
                : await submitPositionPaper(formData);
            if (result.success) onSuccess();
            else setError(result.error ?? 'Something went wrong');
        });
    }

    return (
        <form onSubmit={handleSubmit}>
            <style>{`
                .ppa-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                @media (max-width: 600px) { .ppa-form-grid { grid-template-columns: 1fr; } }
                .ppa-field label { display: block; font-family: var(--font-playfair), serif; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 0.4rem; }
                .ppa-field input, .ppa-field select, .ppa-field input[type=file] {
                    width: 100%; padding: 0.7rem 0.95rem; background: rgba(255,255,255,0.8);
                    border: 1.5px solid var(--border-color); border-radius: 8px;
                    font-family: var(--font-crimson), serif; font-size: 1rem; color: var(--text-primary);
                    transition: border-color 0.2s, box-shadow 0.2s; box-sizing: border-box;
                }
                .ppa-field input:focus, .ppa-field select:focus { outline: none; border-color: var(--accent-color); box-shadow: 0 0 0 3px hsla(205,90%,54%,0.12); }
                .ppa-divider { border: none; border-top: 1px dashed var(--border-color); margin: 1.25rem 0; }
            `}</style>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="ppa-field">
                    <label>Title *</label>
                    <input name="title" required defaultValue={existing?.title ?? ''} placeholder="e.g. Position on Climate Finance in ASEAN" />
                </div>

                <div className="ppa-form-grid">
                    <div className="ppa-field">
                        <label>Committee</label>
                        <input name="committee_name" defaultValue={existing?.committee_name ?? ''} placeholder="e.g. UNEP" />
                    </div>
                    <div className="ppa-field">
                        <label>Conference</label>
                        <input name="conference_name" defaultValue={existing?.conference_name ?? ''} placeholder="e.g. SEAMUN 2025" />
                    </div>
                </div>

                <div className="ppa-field">
                    <label>Topic</label>
                    <input name="topic" defaultValue={existing?.topic ?? ''} placeholder="e.g. Combating plastic pollution in Southeast Asia" />
                </div>

                <div className="ppa-field">
                    <label>Award recognition</label>
                    <select name="best_paper_tag" defaultValue={existing?.best_paper_tag ?? 'none'}>
                        <option value="none">No award</option>
                        <option value="committee">⭐ Best Position Paper (committee)</option>
                        <option value="overall">🏆 Best Position Paper (overall)</option>
                    </select>
                </div>

                <hr className="ppa-divider" />

                <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Provide a <strong>link</strong> (Google Doc, Google Drive PDF, or direct PDF URL) <em>or</em> upload a file (PDF / Word, max 3 MB).
                </p>

                <div className="ppa-field">
                    <label>Link (https://…)</label>
                    <input name="link" type="url" defaultValue={existing?.link ?? ''} placeholder="https://docs.google.com/document/d/…" />
                </div>

                <div className="ppa-field">
                    <label>{existing ? 'Replace file (optional)' : 'Upload file'}</label>
                    <input name="file" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
                </div>

                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    <input type="checkbox" name="own_work_confirmed" required defaultChecked={!!existing} style={{ marginTop: '3px', flexShrink: 0, width: 'auto', accentColor: 'var(--accent-color)' }} />
                    I confirm this is my own work and I have the right to share it publicly.
                </label>

                {error && (
                    <div style={{ padding: '0.75rem 1rem', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', color: '#dc2626', fontSize: '0.875rem' }}>
                        {error}
                    </div>
                )}

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
                    <button type="button" onClick={onCancel} disabled={isPending}
                        style={{ padding: '0.6rem 1.4rem', borderRadius: '8px', border: '1.5px solid var(--border-color)', background: 'transparent', color: 'var(--text-secondary)', fontFamily: 'var(--font-crimson), serif', fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                        Cancel
                    </button>
                    <button type="submit" disabled={isPending}
                        style={{ padding: '0.6rem 1.6rem', borderRadius: '8px', border: 'none', background: 'var(--accent-color)', color: '#fff', fontFamily: 'var(--font-playfair), serif', fontWeight: 700, fontSize: '0.95rem', cursor: isPending ? 'not-allowed' : 'pointer', opacity: isPending ? 0.7 : 1, transition: 'all 0.2s' }}>
                        {isPending ? 'Saving…' : existing ? 'Save changes' : 'Submit to archive'}
                    </button>
                </div>
            </div>
        </form>
    );
}

// ─── Preview overlay ──────────────────────────────────────────────────────────

interface PreviewProps {
    paper: PositionPaper & { has_file?: boolean };
    onClose: () => void;
}

function PreviewPanel({ paper, onClose }: PreviewProps) {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [onClose]);

    const src = paper.link
        ? (isGoogleDocsLink(paper.link) ? toGoogleDocsEmbedUrl(paper.link) : paper.link)
        : `/api/position-papers/${paper.paper_id}`;

    const isPdf = paper.link
        ? paper.link.toLowerCase().endsWith('.pdf') || isGoogleDocsLink(paper.link)
        : paper.file_type === 'application/pdf';

    const canEmbed = isPdf || isGoogleDocsLink(paper.link ?? '');

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', flexDirection: 'column', background: 'rgba(14,22,34,0.92)', backdropFilter: 'blur(6px)' }}>
            {/* Header bar */}
            <div style={{ background: 'rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontFamily: 'var(--font-playfair), serif', fontWeight: 700, color: '#fff', fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{paper.title}</p>
                    {(paper.committee_name || paper.conference_name) && (
                        <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)', letterSpacing: '0.04em' }}>
                            {[paper.committee_name, paper.conference_name].filter(Boolean).join(' · ')}
                        </p>
                    )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                    {paper.link && (
                        <a href={paper.link} target="_blank" rel="noreferrer"
                            style={{ padding: '0.4rem 0.9rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '0.8rem', transition: 'all 0.2s' }}>
                            Open ↗
                        </a>
                    )}
                    {paper.has_file && (
                        <a href={`/api/position-papers/${paper.paper_id}`} download
                            style={{ padding: '0.4rem 0.9rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '0.8rem' }}>
                            Download
                        </a>
                    )}
                    <button onClick={onClose} aria-label="Close"
                        style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'rgba(255,255,255,0.8)', fontSize: '1rem', cursor: 'pointer', lineHeight: 1 }}>
                        ✕
                    </button>
                </div>
            </div>
            {/* Content */}
            <div style={{ flex: 1, overflow: 'hidden', padding: '1rem' }}>
                {canEmbed ? (
                    <iframe src={src} title={paper.title} style={{ width: '100%', height: '100%', border: 'none', borderRadius: '8px', background: '#fff' }}
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups" />
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '1rem' }}>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-crimson), serif', fontSize: '1.05rem' }}>
                            In-page preview is not available for this file type.
                        </p>
                        {paper.has_file && (
                            <a href={`/api/position-papers/${paper.paper_id}`} download
                                style={{ padding: '0.7rem 1.6rem', borderRadius: '8px', background: 'var(--accent-color)', color: '#fff', textDecoration: 'none', fontWeight: 700, fontFamily: 'var(--font-playfair), serif' }}>
                                Download file
                            </a>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Award corner ribbon ──────────────────────────────────────────────────────

function AwardRibbon({ tag }: { tag: string }) {
    if (!tag || tag === 'none') return null;
    const isOverall = tag === 'overall';
    return (
        <div style={{ position: 'absolute', top: 0, right: 0, width: '88px', height: '88px', overflow: 'hidden', borderRadius: '0 14px 0 0', pointerEvents: 'none' }}>
            <div style={{
                position: 'absolute',
                top: '18px', right: '-26px',
                width: '110px',
                background: isOverall
                    ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                    : 'linear-gradient(135deg, hsl(205,85%,48%), hsl(205,85%,38%))',
                color: '#fff',
                fontSize: '0.6rem',
                fontFamily: 'var(--font-playfair), serif',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textAlign: 'center',
                padding: '5px 0',
                transform: 'rotate(45deg)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.18)',
                textTransform: 'uppercase',
            }}>
                {isOverall ? '🏆 Overall' : '⭐ Committee'}
            </div>
        </div>
    );
}

// ─── Paper card ───────────────────────────────────────────────────────────────

interface CardProps {
    paper: PositionPaper & { has_file?: boolean };
    index: number;
    onPreview: (p: PositionPaper & { has_file?: boolean }) => void;
    onEdit: (p: PositionPaper) => void;
    onDelete: (p: PositionPaper) => void;
}

function PaperCard({ paper, index, onPreview, onEdit, onDelete }: CardProps) {
    const [hovered, setHovered] = useState(false);
    const canPreview = !!(paper.link || paper.has_file);
    const isOverall = paper.best_paper_tag === 'overall';
    const isCommittee = paper.best_paper_tag === 'committee';
    const isAward = isOverall || isCommittee;

    // Slight stagger to break robotic symmetry
    const nudge = index % 3 === 1 ? 'translateX(5px)' : index % 3 === 2 ? 'translateX(-3px)' : 'none';

    const cardBg = isOverall
        ? 'linear-gradient(160deg, #fffbeb 0%, #fff 55%)'
        : isCommittee
        ? 'linear-gradient(160deg, #eff8ff 0%, #fff 55%)'
        : '#fff';

    const borderColor = hovered
        ? (isOverall ? '#f59e0b' : isCommittee ? 'var(--accent-color)' : 'var(--accent-color)')
        : (isOverall ? 'rgba(245,158,11,0.4)' : isCommittee ? 'hsla(205,90%,54%,0.3)' : 'var(--border-color)');

    return (
        <article
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: cardBg,
                border: '1.5px solid',
                borderColor,
                borderRadius: '14px',
                overflow: 'hidden',
                transform: hovered ? 'translateY(-3px)' : nudge,
                transition: 'all 0.22s ease',
                boxShadow: hovered
                    ? `0 12px 32px ${isOverall ? 'rgba(245,158,11,0.14)' : 'hsla(205,90%,54%,0.13)'}`
                    : '0 2px 8px rgba(0,0,0,0.05)',
                position: 'relative',
            }}
        >
            <AwardRibbon tag={paper.best_paper_tag} />

            {/* ── Body ── */}
            <div style={{ padding: '1.2rem 1.4rem 0' }}>

                {/* Metadata chips row */}
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.65rem', paddingRight: isAward ? '3.5rem' : '0' }}>
                    {paper.committee_name && (
                        <span style={{
                            display: 'inline-block', padding: '2px 9px',
                            borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700,
                            letterSpacing: '0.05em', textTransform: 'uppercase',
                            fontFamily: 'var(--font-playfair), serif',
                            background: isOverall ? 'rgba(245,158,11,0.1)' : 'hsla(205,90%,54%,0.09)',
                            color: isOverall ? '#92400e' : 'hsl(205,90%,35%)',
                            border: `1px solid ${isOverall ? 'rgba(245,158,11,0.25)' : 'hsla(205,90%,54%,0.2)'}`,
                        }}>
                            {paper.committee_name}
                        </span>
                    )}
                    {paper.conference_name && (
                        <span style={{
                            display: 'inline-block', padding: '2px 9px',
                            borderRadius: '4px', fontSize: '0.7rem', fontWeight: 500,
                            fontFamily: 'var(--font-crimson), serif',
                            background: 'rgba(0,0,0,0.04)',
                            color: 'var(--text-tertiary)',
                            border: '1px solid rgba(0,0,0,0.07)',
                        }}>
                            {paper.conference_name}
                        </span>
                    )}
                </div>

                {/* Title */}
                <h3 style={{
                    margin: '0 0 0.5rem',
                    fontFamily: 'var(--font-playfair), serif',
                    fontSize: '1.08rem', fontWeight: 700,
                    color: 'var(--text-primary)', lineHeight: 1.3,
                    paddingRight: isAward ? '3rem' : '0',
                }}>
                    {paper.title}
                </h3>

                {/* Topic */}
                {paper.topic && (
                    <p style={{
                        margin: '0 0 0.25rem',
                        fontSize: '0.875rem',
                        fontFamily: 'var(--font-crimson), serif',
                        fontStyle: 'italic',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.45,
                        paddingLeft: '0.75rem',
                        borderLeft: `2px solid ${isOverall ? 'rgba(245,158,11,0.3)' : 'hsla(205,90%,54%,0.25)'}`,
                    }}>
                        {paper.topic}
                    </p>
                )}
            </div>

            {/* ── Footer ── */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap',
                padding: '0.75rem 1.4rem',
                marginTop: '0.85rem',
                borderTop: '1px dashed',
                borderColor: isOverall ? 'rgba(245,158,11,0.2)' : 'hsla(205,50%,50%,0.15)',
                background: 'rgba(0,0,0,0.015)',
            }}>
                {/* Primary action */}
                {canPreview && (
                    <button
                        onClick={() => onPreview(paper)}
                        style={{
                            padding: '0.38rem 1rem',
                            borderRadius: '6px',
                            border: 'none',
                            background: isOverall ? '#f59e0b' : 'var(--accent-color)',
                            color: '#fff',
                            fontSize: '0.8rem', fontWeight: 700,
                            fontFamily: 'var(--font-playfair), serif',
                            cursor: 'pointer',
                            letterSpacing: '0.02em',
                            transition: 'opacity 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; }}
                        onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                    >
                        Read paper
                    </button>
                )}
                {paper.link && (
                    <a
                        href={paper.link} target="_blank" rel="noreferrer"
                        style={{
                            padding: '0.38rem 0.85rem',
                            borderRadius: '6px',
                            border: '1.5px solid var(--border-color)',
                            background: 'transparent',
                            color: 'var(--text-secondary)',
                            fontSize: '0.8rem',
                            textDecoration: 'none',
                            fontFamily: 'var(--font-crimson), serif',
                            transition: 'border-color 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-color)'; e.currentTarget.style.color = 'var(--accent-color)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                    >
                        Open ↗
                    </a>
                )}
                {paper.has_file && !paper.link && (
                    <a href={`/api/position-papers/${paper.paper_id}`} download
                        style={{ padding: '0.38rem 0.85rem', borderRadius: '6px', border: '1.5px solid var(--border-color)', background: 'transparent', color: 'var(--text-secondary)', fontSize: '0.8rem', textDecoration: 'none' }}>
                        Download
                    </a>
                )}

                {/* Owner actions — push to right */}
                {paper.is_own && (
                    <span style={{ marginLeft: 'auto', display: 'flex', gap: '0.35rem' }}>
                        <button onClick={() => onEdit(paper)} style={{
                            padding: '0.3rem 0.75rem', borderRadius: '5px',
                            border: '1px solid var(--border-color)', background: 'transparent',
                            color: 'var(--text-secondary)', fontSize: '0.75rem',
                            fontFamily: 'var(--font-crimson), serif', cursor: 'pointer',
                            transition: 'all 0.15s',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-color)'; e.currentTarget.style.color = 'var(--accent-color)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                            Edit
                        </button>
                        <button onClick={() => onDelete(paper)} style={{
                            padding: '0.3rem 0.75rem', borderRadius: '5px',
                            border: '1px solid #fca5a5', background: 'transparent',
                            color: '#dc2626', fontSize: '0.75rem',
                            fontFamily: 'var(--font-crimson), serif', cursor: 'pointer',
                            transition: 'all 0.15s',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                            Delete
                        </button>
                    </span>
                )}
            </div>
        </article>
    );
}

// ─── Filter pill ──────────────────────────────────────────────────────────────

function FilterPill({ label, active, count, onClick }: { label: string; active: boolean; count: number; onClick: () => void }) {
    return (
        <button onClick={onClick} style={{
            padding: '0.4rem 1rem', borderRadius: '999px',
            border: active ? 'none' : '1.5px solid var(--border-color)',
            background: active ? 'var(--accent-color)' : 'rgba(255,255,255,0.7)',
            color: active ? '#fff' : 'var(--text-secondary)',
            fontSize: '0.82rem', fontWeight: active ? 700 : 500,
            fontFamily: 'var(--font-playfair), serif',
            cursor: 'pointer', transition: 'all 0.18s',
            letterSpacing: '0.02em',
        }}>
            {label} <span style={{ opacity: 0.7, fontSize: '0.75rem' }}>({count})</span>
        </button>
    );
}

// ─── Delete confirmation modal ────────────────────────────────────────────────

function DeleteModal({ paper, onCancel, onConfirm, isPending, error }: {
    paper: PositionPaper; onCancel: () => void; onConfirm: () => void; isPending: boolean; error: string | null;
}) {
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(14,22,34,0.7)', zIndex: 1001, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(4px)' }}>
            <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', maxWidth: '400px', width: '100%', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
                <h3 style={{ margin: '0 0 0.6rem', fontFamily: 'var(--font-playfair), serif', fontSize: '1.2rem', color: 'var(--text-primary)' }}>Remove from archive?</h3>
                <p style={{ margin: '0 0 1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                    "<strong>{paper.title}</strong>" will be permanently removed.
                </p>
                {error && <p style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>}
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                    <button onClick={onCancel} disabled={isPending} style={{ padding: '0.6rem 1.3rem', borderRadius: '8px', border: '1.5px solid var(--border-color)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-crimson), serif', fontSize: '0.95rem' }}>
                        Cancel
                    </button>
                    <button onClick={onConfirm} disabled={isPending} style={{ padding: '0.6rem 1.3rem', borderRadius: '8px', border: 'none', background: '#dc2626', color: '#fff', fontWeight: 700, cursor: isPending ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-playfair), serif', fontSize: '0.95rem', opacity: isPending ? 0.7 : 1 }}>
                        {isPending ? 'Removing…' : 'Remove'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────

type FilterType = 'all' | 'overall' | 'committee' | 'none';

interface PositionPaperArchiveClientProps {
    initialPapers: (PositionPaper & { has_file?: boolean })[];
    isSignedIn: boolean;
}

export default function PositionPaperArchiveClient({ initialPapers, isSignedIn }: PositionPaperArchiveClientProps) {
    const [papers, setPapers] = useState(initialPapers);
    const [filter, setFilter] = useState<FilterType>('all');
    const [showForm, setShowForm] = useState(false);
    const [editingPaper, setEditingPaper] = useState<PositionPaper | null>(null);
    const [previewPaper, setPreviewPaper] = useState<(PositionPaper & { has_file?: boolean }) | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<PositionPaper | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const formRef = useRef<HTMLDivElement>(null);

    function handleFormSuccess() {
        setShowForm(false);
        setEditingPaper(null);
        window.location.reload();
    }

    function startEdit(paper: PositionPaper) {
        setEditingPaper(paper);
        setShowForm(false);
        setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    }

    function handleDeleteConfirm() {
        if (!deleteTarget) return;
        setDeleteError(null);
        startTransition(async () => {
            const result = await deletePositionPaper(deleteTarget.paper_id);
            if (result.success) {
                setPapers(prev => prev.filter(p => p.paper_id !== deleteTarget.paper_id));
                setDeleteTarget(null);
            } else {
                setDeleteError(result.error ?? 'Failed to delete');
            }
        });
    }

    const counts = {
        all: papers.length,
        overall: papers.filter(p => p.best_paper_tag === 'overall').length,
        committee: papers.filter(p => p.best_paper_tag === 'committee').length,
        none: papers.filter(p => p.best_paper_tag === 'none').length,
    };

    const displayed = filter === 'all' ? papers : papers.filter(p => p.best_paper_tag === filter);

    // Sort: overall > committee > none, then by date
    const sorted = [...displayed].sort((a, b) => {
        const order = { overall: 0, committee: 1, none: 2 };
        const tagDiff = (order[a.best_paper_tag] ?? 2) - (order[b.best_paper_tag] ?? 2);
        if (tagDiff !== 0) return tagDiff;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    const overall = sorted.filter(p => p.best_paper_tag === 'overall');
    const committee = sorted.filter(p => p.best_paper_tag === 'committee');
    const rest = sorted.filter(p => p.best_paper_tag === 'none');

    return (
        <>
            <style>{`
                @keyframes ppa-fadein { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
                @keyframes ppa-slidein { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }
                .ppa-card-appear { animation: ppa-fadein 0.35s ease both; }
                .ppa-form-appear { animation: ppa-slidein 0.28s ease both; }
            `}</style>

            {/* ── Hero strip ── */}
            <div style={{
                position: 'relative', overflow: 'hidden',
                background: 'linear-gradient(135deg, hsl(205,55%,18%) 0%, hsl(205,65%,24%) 100%)',
                borderRadius: '16px', padding: '2.5rem 2.5rem 2rem', marginBottom: '2.5rem',
                boxShadow: '0 8px 32px hsla(205,65%,20%,0.35)',
            }}>
                {/* Decorative UN-seal watermark */}
                <div aria-hidden style={{
                    position: 'absolute', right: '-20px', top: '-20px',
                    width: '160px', height: '160px',
                    border: '2px solid rgba(255,255,255,0.07)',
                    borderRadius: '50%', pointerEvents: 'none',
                }} />
                <div aria-hidden style={{
                    position: 'absolute', right: '10px', top: '10px',
                    width: '100px', height: '100px',
                    border: '2px solid rgba(255,255,255,0.05)',
                    borderRadius: '50%', pointerEvents: 'none',
                }} />
                {/* Decorative quotemark */}
                <div aria-hidden style={{
                    position: 'absolute', left: '1.5rem', bottom: '-0.5rem',
                    fontFamily: 'var(--font-playfair), serif', fontSize: '8rem', lineHeight: 1,
                    color: 'rgba(255,255,255,0.04)', pointerEvents: 'none', userSelect: 'none',
                }}>§</div>

                <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <div>
                        <p style={{ margin: '0 0 0.5rem', fontFamily: 'var(--font-playfair), serif', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>
                            SEAMUNs Community Resource
                        </p>
                        <h1 style={{ margin: '0 0 0.75rem', fontFamily: 'var(--font-playfair), serif', fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 700, color: '#fff', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
                            Position Paper Archive
                        </h1>
                        <p style={{ margin: 0, fontFamily: 'var(--font-crimson), serif', fontSize: '1.05rem', color: 'rgba(255,255,255,0.65)', maxWidth: '480px', lineHeight: 1.5 }}>
                            Real papers. Real conferences. Browse award-winners and community submissions for honest inspiration before your next committee session.
                        </p>
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'flex', gap: '1.5rem', flexShrink: 0 }}>
                        {counts.overall > 0 && (
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ margin: 0, fontFamily: 'var(--font-playfair), serif', fontSize: '1.8rem', fontWeight: 700, color: '#fbbf24', lineHeight: 1 }}>{counts.overall}</p>
                                <p style={{ margin: '4px 0 0', fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Overall</p>
                            </div>
                        )}
                        {counts.committee > 0 && (
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ margin: 0, fontFamily: 'var(--font-playfair), serif', fontSize: '1.8rem', fontWeight: 700, color: 'hsl(205,90%,75%)', lineHeight: 1 }}>{counts.committee}</p>
                                <p style={{ margin: '4px 0 0', fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Committee</p>
                            </div>
                        )}
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ margin: 0, fontFamily: 'var(--font-playfair), serif', fontSize: '1.8rem', fontWeight: 700, color: '#fff', lineHeight: 1 }}>{counts.all}</p>
                            <p style={{ margin: '4px 0 0', fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Total</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Action bar ── */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                {/* Filters */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {(['all', 'overall', 'committee', 'none'] as FilterType[]).map(f => (
                        <FilterPill
                            key={f}
                            label={f === 'all' ? 'All papers' : f === 'overall' ? '🏆 Best Overall' : f === 'committee' ? '⭐ Best Committee' : 'No award'}
                            active={filter === f}
                            count={counts[f]}
                            onClick={() => setFilter(f)}
                        />
                    ))}
                </div>

                {/* CTA */}
                {isSignedIn && !showForm && !editingPaper ? (
                    <button onClick={() => { setShowForm(true); setEditingPaper(null); setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50); }}
                        style={{ padding: '0.55rem 1.4rem', borderRadius: '8px', border: 'none', background: 'var(--accent-color)', color: '#fff', fontFamily: 'var(--font-playfair), serif', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', letterSpacing: '0.02em', boxShadow: '0 2px 8px hsla(205,90%,54%,0.3)', transition: 'all 0.18s', flexShrink: 0 }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 16px hsla(205,90%,54%,0.35)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px hsla(205,90%,54%,0.3)'; }}>
                        Share yours →
                    </button>
                ) : !isSignedIn ? (
                    <a href="/sign-in" style={{ padding: '0.55rem 1.4rem', borderRadius: '8px', border: '1.5px solid var(--border-color)', background: 'rgba(255,255,255,0.6)', color: 'var(--text-secondary)', fontFamily: 'var(--font-playfair), serif', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', flexShrink: 0, letterSpacing: '0.02em' }}>
                        Sign in to share →
                    </a>
                ) : null}
            </div>

            {/* ── Submit / edit form ── */}
            {(showForm || editingPaper) && (
                <div ref={formRef} className="ppa-form-appear" style={{ background: 'rgba(255,255,255,0.9)', border: '1.5px solid var(--border-color)', borderRadius: '14px', padding: '1.75rem', marginBottom: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <h2 style={{ margin: 0, fontFamily: 'var(--font-playfair), serif', fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {editingPaper ? 'Edit your paper' : 'Add a paper to the archive'}
                        </h2>
                        <button onClick={() => { setShowForm(false); setEditingPaper(null); }}
                            style={{ background: 'none', border: 'none', fontSize: '1.1rem', color: 'var(--text-tertiary)', cursor: 'pointer', padding: '0.25rem' }}>✕</button>
                    </div>
                    <PaperForm existing={editingPaper ?? undefined} onCancel={() => { setShowForm(false); setEditingPaper(null); }} onSuccess={handleFormSuccess} />
                </div>
            )}

            {/* ── Papers ── */}
            {sorted.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'rgba(255,255,255,0.6)', borderRadius: '16px', border: '1.5px dashed var(--border-color)' }}>
                    <p style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                        {filter === 'all' ? 'No papers yet.' : 'No papers with this filter.'}
                    </p>
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
                        {filter === 'all' ? 'Be the first to share a position paper with the community.' : 'Try a different filter or share one yourself.'}
                    </p>
                </div>
            ) : (
                <>
                    {/* Award winners — prominent */}
                    {(filter === 'all' || filter === 'overall') && overall.length > 0 && (
                        <section style={{ marginBottom: '2.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                <div style={{ height: '1.5px', flex: 1, background: 'linear-gradient(90deg, #f59e0b, transparent)' }} />
                                <p style={{ margin: 0, fontFamily: 'var(--font-playfair), serif', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#b45309' }}>
                                    🏆 Best Position Paper — Overall
                                </p>
                                <div style={{ height: '1.5px', flex: 1, background: 'linear-gradient(270deg, #f59e0b, transparent)' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {overall.map((p, i) => <PaperCard key={p.paper_id} paper={p} index={i} onPreview={setPreviewPaper} onEdit={startEdit} onDelete={setDeleteTarget} />)}
                            </div>
                        </section>
                    )}

                    {/* Committee winners */}
                    {(filter === 'all' || filter === 'committee') && committee.length > 0 && (
                        <section style={{ marginBottom: '2.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                <div style={{ height: '1.5px', flex: 1, background: 'linear-gradient(90deg, var(--accent-color), transparent)' }} />
                                <p style={{ margin: 0, fontFamily: 'var(--font-playfair), serif', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'hsl(205,90%,34%)' }}>
                                    ⭐ Best Position Paper — Committee
                                </p>
                                <div style={{ height: '1.5px', flex: 1, background: 'linear-gradient(270deg, var(--accent-color), transparent)' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {committee.map((p, i) => <PaperCard key={p.paper_id} paper={p} index={i} onPreview={setPreviewPaper} onEdit={startEdit} onDelete={setDeleteTarget} />)}
                            </div>
                        </section>
                    )}

                    {/* Rest */}
                    {(filter === 'all' || filter === 'none') && rest.length > 0 && (
                        <section style={{ marginBottom: '1rem' }}>
                            {(overall.length > 0 || committee.length > 0) && filter === 'all' && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                    <div style={{ height: '1px', flex: 1, background: 'var(--border-color)' }} />
                                    <p style={{ margin: 0, fontFamily: 'var(--font-playfair), serif', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
                                        Community submissions
                                    </p>
                                    <div style={{ height: '1px', flex: 1, background: 'var(--border-color)' }} />
                                </div>
                            )}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {rest.map((p, i) => <PaperCard key={p.paper_id} paper={p} index={i} onPreview={setPreviewPaper} onEdit={startEdit} onDelete={setDeleteTarget} />)}
                            </div>
                        </section>
                    )}
                </>
            )}

            {/* ── Footer note ── */}
            <p style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-crimson), serif', fontStyle: 'italic' }}>
                No uploader names are shown. Award tags are self-reported by the submitter.
            </p>

            {/* ── Modals ── */}
            {previewPaper && <PreviewPanel paper={previewPaper} onClose={() => setPreviewPaper(null)} />}
            {deleteTarget && (
                <DeleteModal
                    paper={deleteTarget}
                    onCancel={() => setDeleteTarget(null)}
                    onConfirm={handleDeleteConfirm}
                    isPending={isPending}
                    error={deleteError}
                />
            )}
        </>
    );
}
