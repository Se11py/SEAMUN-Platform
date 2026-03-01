'use client';
import { useTransition } from 'react';
import { deleteConference } from '@/lib/admin-actions';

export default function DeleteButton({ id }: { id: number }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this conference? This action cannot be undone.')) {
            startTransition(async () => {
                try {
                    await deleteConference(id);
                } catch (error) {
                    console.error('Failed to delete conference', error);
                    alert('Failed to delete conference. Make sure you have admin privileges.');
                }
            });
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            title="Delete"
            style={{
                color: '#ef4444',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                opacity: isPending ? 0.5 : 1,
                fontSize: '1.1rem'
            }}
        >
            <i className="fas fa-trash"></i>
        </button>
    );
}
