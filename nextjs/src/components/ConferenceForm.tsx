'use client';

import { useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ConferenceForm({
    initialData,
    action
}: {
    initialData?: any,
    action: (formData: FormData) => Promise<any>
}) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    // Real-time Validation State
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        return new Date(dateString).toISOString().split('T')[0];
    };

    const validateField = (name: string, value: string) => {
        let error = "";
        if (name === 'name' && value.length < 3 && value.length > 0) error = "Conference Name must be at least 3 characters.";
        if (name === 'organization' && value.length < 2 && value.length > 0) error = "Organization Name must be at least 2 characters.";
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

        // Final pre-flight Validation
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

        if (hasErrors) {
            setErrors(newErrors);
            setTouched({ name: true, organization: true, website: true });
            return;
        }

        startTransition(async () => {
            try {
                await action(formData);
                router.push('/admin');
            } catch (error) {
                setErrors({ global: "Failed to save conference. Ensure you have admin rights and a valid internet connection." });
            }
        });
    };

    const inputStyle = (fieldName: string) => ({
        width: '100%',
        padding: '0.75rem',
        borderRadius: '0.375rem',
        border: `1px solid ${errors[fieldName] && touched[fieldName] ? '#ef4444' : '#d1d5db'}`,
        marginTop: '0.25rem',
        outline: 'none',
        transition: 'border-color 0.2s'
    });

    const labelStyle = {
        display: 'block',
        fontWeight: '500',
        color: '#374151',
        marginTop: '1rem'
    };

    const errorStyle = {
        color: '#ef4444',
        fontSize: '0.875rem',
        marginTop: '0.25rem',
        display: 'block'
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '800px', background: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>

            {errors.global && (
                <div style={{ background: '#fef2f2', borderLeft: '4px solid #ef4444', padding: '1rem', marginBottom: '1.5rem', borderRadius: '0.25rem' }}>
                    <p style={{ margin: 0, color: '#991b1b', fontWeight: '500' }}>{errors.global}</p>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                    <label style={labelStyle}>Conference Name *</label>
                    <input type="text" name="name" required defaultValue={initialData?.name} onChange={handleChange} onBlur={handleBlur} style={inputStyle('name')} />
                    {errors.name && touched.name && <span style={errorStyle}>{errors.name}</span>}
                </div>
                <div>
                    <label style={labelStyle}>Organization *</label>
                    <input type="text" name="organization" required defaultValue={initialData?.organization} onChange={handleChange} onBlur={handleBlur} style={inputStyle('organization')} />
                    {errors.organization && touched.organization && <span style={errorStyle}>{errors.organization}</span>}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                    <label style={labelStyle}>Location *</label>
                    <input type="text" name="location" required defaultValue={initialData?.location} onChange={handleChange} onBlur={handleBlur} style={inputStyle('location')} />
                    {errors.location && touched.location && <span style={errorStyle}>{errors.location}</span>}
                </div>
                <div>
                    <label style={labelStyle}>Country Code</label>
                    <input type="text" name="country_code" defaultValue={initialData?.country_code} onChange={handleChange} onBlur={handleBlur} placeholder="e.g. TH" maxLength={2} style={inputStyle('country_code')} />
                </div>
                <div>
                    <label style={labelStyle}>Status *</label>
                    <select name="status" required defaultValue={initialData?.status || 'upcoming'} onChange={handleChange} onBlur={handleBlur} style={inputStyle('status')}>
                        <option value="upcoming">Upcoming</option>
                        <option value="previous">Previous</option>
                    </select>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                    <label style={labelStyle}>Start Date *</label>
                    <input type="date" name="start_date" required defaultValue={formatDate(initialData?.start_date)} onChange={handleChange} onBlur={handleBlur} style={inputStyle('start_date')} />
                </div>
                <div>
                    <label style={labelStyle}>End Date *</label>
                    <input type="date" name="end_date" required defaultValue={formatDate(initialData?.end_date)} onChange={handleChange} onBlur={handleBlur} style={inputStyle('end_date')} />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                    <label style={labelStyle}>Size (e.g., 500+)</label>
                    <input type="text" name="size" defaultValue={initialData?.size} onChange={handleChange} onBlur={handleBlur} style={inputStyle('size')} />
                </div>
                <div>
                    <label style={labelStyle}>Price per Delegate</label>
                    <input type="text" name="price_per_delegate" defaultValue={initialData?.price_per_delegate} onChange={handleChange} onBlur={handleBlur} style={inputStyle('price_per_delegate')} />
                </div>
            </div>

            <div>
                <label style={labelStyle}>Website URL</label>
                <input type="url" name="website" defaultValue={initialData?.website} onChange={handleChange} onBlur={handleBlur} placeholder="https://" style={inputStyle('website')} />
                {errors.website && touched.website && <span style={errorStyle}>{errors.website}</span>}
            </div>

            <div>
                <label style={labelStyle}>Description</label>
                <textarea name="description" rows={5} defaultValue={initialData?.description} onChange={handleChange} onBlur={handleBlur} style={inputStyle('description')} />
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                <button type="submit" disabled={isPending || Object.values(errors).some(e => e !== "")} style={{
                    background: Object.values(errors).some(e => e !== "") ? '#9ca3af' : '#2563eb', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.375rem', fontWeight: 'bold', border: 'none', cursor: Object.values(errors).some(e => e !== "") ? 'not-allowed' : 'pointer', opacity: isPending ? 0.7 : 1, transition: 'background-color 0.2s'
                }}>
                    {isPending ? 'Saving...' : 'Save Conference'}
                </button>
                <Link href="/admin" style={{
                    background: '#f1f5f9', color: '#475569', padding: '0.75rem 1.5rem', borderRadius: '0.375rem', fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center'
                }}>
                    Cancel
                </Link>
            </div>

        </form>
    );
}

