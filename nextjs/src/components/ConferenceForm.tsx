'use client';

import { useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type CommitteeChairDraft = {
    role: string;
    contact: string;
};

type CommitteeDraft = {
    name: string;
    topic: string;
    chairs: CommitteeChairDraft[];
};

const STANDARD_CHAIR_ROLES = ['Head Chair', 'Deputy Chair', 'Back Room Chair', 'Front Room Chair'] as const;
const PRESS_CHAIR_ROLES = ['Chief Editor', 'Editor'] as const;
const MAX_CHAIRS_PER_COMMITTEE = 5;

function isPressCommittee(name: string) {
    return /press\s*corps?/i.test(name);
}

function defaultChairsForCommittee(pressCommittee: boolean): CommitteeChairDraft[] {
    if (pressCommittee) {
        return [
            { role: 'Chief Editor', contact: '' },
            { role: 'Editor', contact: '' },
        ];
    }

    return [
        { role: 'Head Chair', contact: '' },
        { role: 'Deputy Chair', contact: '' },
    ];
}

function allowedRolesForCommittee(name: string) {
    return isPressCommittee(name) ? [...PRESS_CHAIR_ROLES] : [...STANDARD_CHAIR_ROLES];
}

function getDefaultRoleForIndex(name: string, index: number) {
    if (isPressCommittee(name)) {
        return index === 0 ? 'Chief Editor' : 'Editor';
    }

    return index === 0 ? 'Head Chair' : index === 1 ? 'Deputy Chair' : 'Deputy Chair';
}

function normalizeChairRole(role: string, committeeName: string, index: number) {
    const allowedRoles = allowedRolesForCommittee(committeeName);
    if ((allowedRoles as readonly string[]).includes(role)) {
        return role;
    }

    return getDefaultRoleForIndex(committeeName, index);
}

function normalizeChairs(chairs: CommitteeChairDraft[] | undefined, committeeName: string) {
    const fallbackChairs = defaultChairsForCommittee(isPressCommittee(committeeName));
    const sourceChairs = chairs && chairs.length > 0 ? chairs : fallbackChairs;
    const normalizedChairs = sourceChairs.slice(0, MAX_CHAIRS_PER_COMMITTEE).map((chair, index) => ({
        role: normalizeChairRole(chair.role || '', committeeName, index),
        contact: chair.contact || '',
    }));

    while (normalizedChairs.length < 2) {
        normalizedChairs.push({
            role: getDefaultRoleForIndex(committeeName, normalizedChairs.length),
            contact: '',
        });
    }

    return normalizedChairs;
}

function parseChairInfo(chairInfo: string | null | undefined, committeeName: string) {
    const normalizedCommitteeName = committeeName || '';
    if (!chairInfo) {
        return defaultChairsForCommittee(isPressCommittee(normalizedCommitteeName));
    }

    const rolePattern = /(Head Chair|Deputy Chair|Back Room Chair|Front Room Chair|Chief Editor|Editor in Chief|Editor)\s*:\s*/g;
    const matches = Array.from(chairInfo.matchAll(rolePattern));

    if (matches.length === 0) {
        const defaultChairs = defaultChairsForCommittee(isPressCommittee(normalizedCommitteeName));
        defaultChairs[0] = {
            role: defaultChairs[0]?.role ?? getDefaultRoleForIndex(normalizedCommitteeName, 0),
            contact: chairInfo.trim(),
        };
        return defaultChairs;
    }

    const chairs = matches.map((match, index) => {
        const startIndex = match.index ?? 0;
        const contentStart = startIndex + match[0].length;
        const nextMatch = matches[index + 1];
        const contentEnd = nextMatch?.index ?? chairInfo.length;
        const matchedRole = match[1] ?? getDefaultRoleForIndex(normalizedCommitteeName, index);
        const rawRole = matchedRole === 'Editor in Chief' ? 'Chief Editor' : matchedRole;
        const contact = chairInfo
            .slice(contentStart, contentEnd)
            .replace(/^[,\s|]+|[,\s|]+$/g, '')
            .trim();

        return { role: rawRole, contact };
    });

    return normalizeChairs(chairs, normalizedCommitteeName);
}

export default function ConferenceForm({
    initialData,
    action
}: {
    initialData?: any,
    action: (formData: FormData) => Promise<{ success?: boolean; notice?: string } | any>
}) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const initialUniqueTopics = Array.isArray(initialData?.uniqueTopics)
        ? initialData.uniqueTopics
        : Array.isArray(initialData?.unique_topics)
            ? initialData.unique_topics
            : [''];
    const initialAllocations = Array.isArray(initialData?.allocations)
        ? initialData.allocations
        : [''];
    const initialCommittees = Array.isArray(initialData?.committees) && initialData.committees.length > 0
        ? initialData.committees.map((committee: any) => ({
            name: committee.name || '',
            topic: committee.topic || '',
            chairs: parseChairInfo(committee.chair_info, committee.name || ''),
        }))
        : [{ name: '', topic: '', chairs: defaultChairsForCommittee(false) }];

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [uniqueTopics, setUniqueTopics] = useState<string[]>(initialUniqueTopics);
    const [allocations, setAllocations] = useState<string[]>(initialAllocations);
    const [committees, setCommittees] = useState<CommitteeDraft[]>(initialCommittees);

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        return new Date(dateString).toISOString().split('T')[0];
    };

    const validateField = (name: string, value: string) => {
        let error = "";
        if (name === 'name' && value.length < 3 && value.length > 0) error = "Conference Name must be at least 3 characters.";
        if (name === 'organization' && value.length < 2 && value.length > 0) error = "School name must be at least 2 characters.";
        if (name === 'website' && value.length > 0) {
            try {
                new URL(value);
            } catch (_) {
                error = "Please enter a valid absolute URL (e.g. https://www.seamuns.org).";
            }
        }
        return error;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        let hasErrors = false;
        const newErrors: Record<string, string> = {};

        ['name', 'organization', 'website'].forEach(key => {
            const val = formData.get(key) as string || '';
            const err = validateField(key, val);
            if (err) {
                newErrors[key] = err;
                hasErrors = true;
            }
        });

        const invalidCommittee = committees.find((committee) => {
            const hasCommitteeContent = Boolean(committee.name.trim() || committee.topic.trim() || committee.chairs.some((chair) => chair.contact.trim()));
            if (!hasCommitteeContent) return false;

            const filledChairContacts = committee.chairs.filter((chair) => chair.contact.trim()).length;
            return filledChairContacts < 2;
        });

        if (invalidCommittee) {
            setErrors({
                ...newErrors,
                global: 'Each committee must include at least 2 chair contacts.',
            });
            return;
        }

        if (hasErrors) {
            setErrors(newErrors);
            setTouched({ name: true, organization: true, website: true });
            return;
        }

        startTransition(async () => {
            try {
                const result = await action(formData);
                const notice = result?.notice || 'Conference saved successfully.';
                router.push(`/admin?notice=${encodeURIComponent(notice)}`);
            } catch (error) {
                const message = error instanceof Error
                    ? error.message
                    : 'Failed to save conference. Ensure you have admin rights and a valid internet connection.';
                setErrors({ global: message });
            }
        });
    };

    const inputCls = (fieldName: string) =>
        `adm-input${errors[fieldName] && touched[fieldName] ? ' error' : ''}`;

    const textareaCls = (fieldName: string) =>
        `adm-textarea${errors[fieldName] && touched[fieldName] ? ' error' : ''}`;

    const updateListItem = (
        setter: React.Dispatch<React.SetStateAction<string[]>>,
        index: number,
        value: string
    ) => {
        setter((prev) => prev.map((item, itemIndex) => itemIndex === index ? value : item));
    };

    const addListItem = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
        setter((prev) => [...prev, '']);
    };

    const removeListItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
        setter((prev) => prev.length > 1 ? prev.filter((_, itemIndex) => itemIndex !== index) : ['']);
    };

    const updateCommittee = (index: number, field: 'name' | 'topic', value: string) => {
        setCommittees((prev) => prev.map((committee, committeeIndex) => (
            committeeIndex === index
                ? {
                    ...committee,
                    [field]: value,
                    ...(field === 'name' ? { chairs: normalizeChairs(committee.chairs, value) } : {})
                }
                : committee
        )));
    };

    const addCommittee = () => {
        setCommittees((prev) => [...prev, { name: '', topic: '', chairs: defaultChairsForCommittee(false) }]);
    };

    const removeCommittee = (index: number) => {
        setCommittees((prev) => prev.length > 1
            ? prev.filter((_, committeeIndex) => committeeIndex !== index)
            : [{ name: '', topic: '', chairs: defaultChairsForCommittee(false) }]);
    };

    const updateCommitteeChair = (committeeIndex: number, chairIndex: number, field: keyof CommitteeChairDraft, value: string) => {
        setCommittees((prev) => prev.map((committee, currentCommitteeIndex) => {
            if (currentCommitteeIndex !== committeeIndex) {
                return committee;
            }

            return {
                ...committee,
                chairs: committee.chairs.map((chair, currentChairIndex) => (
                    currentChairIndex === chairIndex
                        ? { ...chair, [field]: value }
                        : chair
                ))
            };
        }));
    };

    const addCommitteeChair = (committeeIndex: number) => {
        setCommittees((prev) => prev.map((committee, currentCommitteeIndex) => {
            if (currentCommitteeIndex !== committeeIndex || committee.chairs.length >= MAX_CHAIRS_PER_COMMITTEE) {
                return committee;
            }

            return {
                ...committee,
                chairs: [
                    ...committee.chairs,
                    {
                        role: getDefaultRoleForIndex(committee.name, committee.chairs.length),
                        contact: '',
                    }
                ]
            };
        }));
    };

    const removeCommitteeChair = (committeeIndex: number, chairIndex: number) => {
        setCommittees((prev) => prev.map((committee, currentCommitteeIndex) => {
            if (currentCommitteeIndex !== committeeIndex || committee.chairs.length <= 2) {
                return committee;
            }

            return {
                ...committee,
                chairs: committee.chairs.filter((_, currentChairIndex) => currentChairIndex !== chairIndex)
            };
        }));
    };

    const hasAnyError = Object.values(errors).some(e => e !== "");

    return (
        <form onSubmit={handleSubmit} className="adm-form">

            {errors.global && (
                <div className="adm-form-error-banner">{errors.global}</div>
            )}

            {/* ── Basic Info ── */}
            <div className="adm-form-section">
                <h3 className="adm-form-section-title"><i className="fas fa-info-circle"></i> Basic Info</h3>

                <div className="adm-form-row cols-2">
                    <div className="adm-form-field">
                        <label className="adm-label">Conference Name *</label>
                        <input type="text" name="name" required defaultValue={initialData?.name} onChange={handleChange} onBlur={handleBlur} className={inputCls('name')} />
                        {errors.name && touched.name && <div className="adm-error-text">{errors.name}</div>}
                    </div>
                    <div className="adm-form-field">
                        <label className="adm-label">School *</label>
                        <input type="text" name="organization" required defaultValue={initialData?.organization} onChange={handleChange} onBlur={handleBlur} className={inputCls('organization')} />
                        {errors.organization && touched.organization && <div className="adm-error-text">{errors.organization}</div>}
                    </div>
                </div>

                <div className="adm-form-row cols-2">
                    <div className="adm-form-field">
                        <label className="adm-label">Location *</label>
                        <input type="text" name="location" required defaultValue={initialData?.location} onChange={handleChange} onBlur={handleBlur} className={inputCls('location')} />
                    </div>
                    <div className="adm-form-field">
                        <label className="adm-label">Country Code</label>
                        <input type="text" name="country_code" defaultValue={initialData?.country_code} onChange={handleChange} onBlur={handleBlur} placeholder="e.g. TH" maxLength={2} className="adm-input" />
                    </div>
                </div>

                <div className="adm-form-field">
                    <label className="adm-label">Description</label>
                    <textarea name="description" rows={4} defaultValue={initialData?.description} onChange={handleChange} onBlur={handleBlur} className={textareaCls('description')} />
                </div>
            </div>

            {/* ── Dates & Deadlines ── */}
            <div className="adm-form-section">
                <h3 className="adm-form-section-title"><i className="fas fa-calendar-alt"></i> Dates &amp; Deadlines</h3>

                <div className="adm-form-row cols-2">
                    <div className="adm-form-field">
                        <label className="adm-label">Start Date *</label>
                        <input type="date" name="start_date" required defaultValue={formatDate(initialData?.start_date)} onChange={handleChange} onBlur={handleBlur} className="adm-input" />
                    </div>
                    <div className="adm-form-field">
                        <label className="adm-label">End Date *</label>
                        <input type="date" name="end_date" required defaultValue={formatDate(initialData?.end_date)} onChange={handleChange} onBlur={handleBlur} className="adm-input" />
                    </div>
                </div>

                <div className="adm-form-row cols-2">
                    <div className="adm-form-field">
                        <label className="adm-label">Registration Closes</label>
                        <input type="date" name="registration_deadline" defaultValue={formatDate(initialData?.registration_deadline)} onChange={handleChange} onBlur={handleBlur} className="adm-input" />
                    </div>
                    <div className="adm-form-field">
                        <label className="adm-label">Position Paper Due</label>
                        <input type="date" name="position_paper_deadline" defaultValue={formatDate(initialData?.position_paper_deadline)} onChange={handleChange} onBlur={handleBlur} className="adm-input" />
                    </div>
                </div>
            </div>

            {/* ── Details ── */}
            <div className="adm-form-section">
                <h3 className="adm-form-section-title"><i className="fas fa-sliders-h"></i> Details</h3>

                <div className="adm-form-row cols-2">
                    <div className="adm-form-field">
                        <label className="adm-label">Size</label>
                        <input type="text" name="size" defaultValue={initialData?.size} onChange={handleChange} onBlur={handleBlur} placeholder="e.g. 250+ attendees" className="adm-input" />
                    </div>
                    <div className="adm-form-field">
                        <label className="adm-label">Price per Delegate</label>
                        <input type="text" name="price_per_delegate" defaultValue={initialData?.price_per_delegate} onChange={handleChange} onBlur={handleBlur} placeholder="e.g. 900 THB" className="adm-input" />
                    </div>
                </div>

                <div className="adm-form-row cols-2">
                    <div className="adm-form-field">
                        <label className="adm-label">Contact Email</label>
                        <input type="email" name="general_email" defaultValue={initialData?.general_email} onChange={handleChange} onBlur={handleBlur} placeholder="contact@example.com" className="adm-input" />
                    </div>
                    <div className="adm-form-field">
                        <label className="adm-label">Instagram</label>
                        <input type="text" name="mun_account" defaultValue={initialData?.mun_account} onChange={handleChange} onBlur={handleBlur} placeholder="@conferenceaccount" className="adm-input" />
                    </div>
                </div>

                <div className="adm-form-field">
                    <label className="adm-label">Website URL</label>
                    <input type="url" name="website" defaultValue={initialData?.website} onChange={handleChange} onBlur={handleBlur} placeholder="https://" className={inputCls('website')} />
                    {errors.website && touched.website && <div className="adm-error-text">{errors.website}</div>}
                </div>
            </div>

            {/* ── Unique Topics ── */}
            <div className="adm-form-section">
                <h3 className="adm-form-section-title"><i className="fas fa-lightbulb"></i> Unique Topics</h3>
                <p className="adm-helper-text">Add one topic per row.</p>

                {uniqueTopics.map((topic, index) => (
                    <div key={`topic-${index}`} className="adm-list-row">
                        <input
                            type="text"
                            name="unique_topics"
                            value={topic}
                            onChange={(e) => updateListItem(setUniqueTopics, index, e.target.value)}
                            className="adm-input"
                            placeholder="e.g. Climate migration in ASEAN"
                        />
                        <button type="button" onClick={() => removeListItem(setUniqueTopics, index)} className="adm-btn adm-btn-ghost danger" title="Remove topic">
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                ))}
                <button type="button" onClick={() => addListItem(setUniqueTopics)} className="adm-btn adm-btn-secondary" style={{ marginTop: '0.5rem' }}>
                    <i className="fas fa-plus"></i> Add Topic
                </button>
            </div>

            {/* ── Allocations ── */}
            <div className="adm-form-section">
                <h3 className="adm-form-section-title"><i className="fas fa-flag"></i> Allocations</h3>
                <p className="adm-helper-text">Add one allocation or country per row.</p>

                {allocations.map((allocation, index) => (
                    <div key={`allocation-${index}`} className="adm-list-row">
                        <input
                            type="text"
                            name="allocations"
                            value={allocation}
                            onChange={(e) => updateListItem(setAllocations, index, e.target.value)}
                            className="adm-input"
                            placeholder="e.g. Thailand"
                        />
                        <button type="button" onClick={() => removeListItem(setAllocations, index)} className="adm-btn adm-btn-ghost danger" title="Remove allocation">
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                ))}
                <button type="button" onClick={() => addListItem(setAllocations)} className="adm-btn adm-btn-secondary" style={{ marginTop: '0.5rem' }}>
                    <i className="fas fa-plus"></i> Add Allocation
                </button>
            </div>

            {/* ── Committees ── */}
            <div className="adm-form-section">
                <h3 className="adm-form-section-title"><i className="fas fa-users"></i> Committees</h3>
                <p className="adm-helper-text">Each committee needs at least 2 chairs. Press Corps uses Editor roles instead of Chair roles.</p>

                {committees.map((committee, index) => (
                    <div key={`committee-${index}`} className="adm-committee-card">
                        <div className="adm-committee-header">
                            <span className="adm-committee-number">Committee {index + 1}</span>
                            <button type="button" onClick={() => removeCommittee(index)} className="adm-btn adm-btn-ghost danger" title="Remove committee">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <div className="adm-form-field">
                            <label className="adm-label">Committee Name</label>
                            <input
                                type="text"
                                name="committee_name"
                                value={committee.name}
                                onChange={(e) => updateCommittee(index, 'name', e.target.value)}
                                className="adm-input"
                                placeholder="e.g. UNHRC"
                            />
                        </div>

                        <div className="adm-form-field">
                            <label className="adm-label">Topic</label>
                            <textarea
                                name="committee_topic"
                                rows={2}
                                value={committee.topic}
                                onChange={(e) => updateCommittee(index, 'topic', e.target.value)}
                                className={textareaCls(`committee_topic_${index}`)}
                                placeholder="e.g. The Question of ..."
                            />
                        </div>

                        <div className="adm-form-field">
                            <label className="adm-label">Chairs</label>
                            <p className="adm-helper-text" style={{ marginBottom: '0.5rem' }}>
                                {isPressCommittee(committee.name)
                                    ? 'Press Corps uses Chief Editor and Editor roles.'
                                    : 'Up to 5 chairs. Change each role as needed.'}
                            </p>

                            {committee.chairs.map((chair, chairIndex) => (
                                <div key={`committee-${index}-chair-${chairIndex}`} className="adm-chair-row">
                                    <select
                                        value={chair.role}
                                        onChange={(e) => updateCommitteeChair(index, chairIndex, 'role', e.target.value)}
                                        className="adm-select"
                                    >
                                        {allowedRolesForCommittee(committee.name).map((role) => (
                                            <option key={role} value={role}>{role}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="text"
                                        value={chair.contact}
                                        onChange={(e) => updateCommitteeChair(index, chairIndex, 'contact', e.target.value)}
                                        className="adm-input"
                                        placeholder={isPressCommittee(committee.name) ? 'e.g. Jamie (@presschair)' : 'e.g. Ana (@anachair)'}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeCommitteeChair(index, chairIndex)}
                                        className="adm-btn adm-btn-ghost danger"
                                        disabled={committee.chairs.length <= 2}
                                        title="Remove chair"
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            ))}

                            <input type="hidden" name="committee_chairs" value={JSON.stringify(committee.chairs)} />

                            <button
                                type="button"
                                onClick={() => addCommitteeChair(index)}
                                className="adm-btn adm-btn-secondary"
                                disabled={committee.chairs.length >= MAX_CHAIRS_PER_COMMITTEE}
                                style={{ marginTop: '0.5rem' }}
                            >
                                <i className="fas fa-plus"></i> Add Chair
                            </button>
                        </div>
                    </div>
                ))}

                <button type="button" onClick={addCommittee} className="adm-btn adm-btn-secondary" style={{ marginTop: '0.75rem' }}>
                    <i className="fas fa-plus"></i> Add Committee
                </button>
            </div>

            {/* ── Footer ── */}
            <div className="adm-form-footer">
                <button
                    type="submit"
                    disabled={isPending || hasAnyError}
                    className="adm-btn adm-btn-primary"
                    style={{ opacity: isPending ? 0.7 : 1 }}
                >
                    {isPending ? (
                        <><i className="fas fa-spinner fa-spin"></i> Saving...</>
                    ) : (
                        <><i className="fas fa-check"></i> Save Conference</>
                    )}
                </button>
                <Link href="/admin" className="adm-btn adm-btn-secondary">
                    Cancel
                </Link>
            </div>
        </form>
    );
}
