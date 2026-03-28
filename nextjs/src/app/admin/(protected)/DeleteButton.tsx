'use client';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteConference } from '@/lib/admin-actions';

export default function DeleteButton({ id }: { id: number }) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this conference? This action cannot be undone.')) {
            startTransition(async () => {
                try {
                    await deleteConference(id);
                    router.push('/admin?notice=Conference%20deleted.');
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
            className="adm-btn adm-btn-ghost danger"
        >
            <i className="fas fa-trash-alt"></i>
        </button>
    );
}
