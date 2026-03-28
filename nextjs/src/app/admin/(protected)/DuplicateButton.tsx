'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { duplicateConference } from '@/lib/admin-actions';

export default function DuplicateButton({ id }: { id: number }) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleDuplicate = () => {
        startTransition(async () => {
            try {
                const result = await duplicateConference(id);
                const notice = result?.notice || 'Conference duplicated successfully.';
                router.push(`/admin?notice=${encodeURIComponent(notice)}`);
            } catch (error) {
                console.error('Failed to duplicate conference', error);
                alert(error instanceof Error ? error.message : 'Failed to duplicate conference.');
            }
        });
    };

    return (
        <button
            onClick={handleDuplicate}
            disabled={isPending}
            title="Duplicate"
            className="adm-btn adm-btn-ghost teal"
        >
            <i className="fas fa-copy"></i>
        </button>
    );
}
