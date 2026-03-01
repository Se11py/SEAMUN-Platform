'use client';

import { useState } from 'react';

interface CopyButtonProps {
    text: string;
    isInstagram?: boolean;
    isEmail?: boolean;
}

export default function CopyButton({ text, isInstagram, isEmail }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <button
            className={`conf-detail-copy-btn ${copied ? 'copied' : ''}`}
            onClick={handleCopy}
            title={`Copy ${text}`}
        >
            {isInstagram && <i className="fab fa-instagram"></i>}
            {isEmail && <i className="fas fa-envelope"></i>}
            {' '}{text}
            <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`}></i>
        </button>
    );
}
