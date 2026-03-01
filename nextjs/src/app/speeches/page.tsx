import ContentPage from '@/components/ContentPage';
import Link from 'next/link';

export default function SpeechesPage() {
    return (
        <ContentPage title="🎤 Speeches">
            <p>Effective speeches are key to success in MUN. Here&apos;s how to deliver impactful remarks.</p>

            <h3>Types of Speeches</h3>
            <ul>
                <li><strong>Opening Speech</strong> — Introduce your country&apos;s position (1-2 minutes)</li>
                <li><strong>Moderated Caucus Speech</strong> — Short, focused comments on specific aspects</li>
                <li><strong>Resolution Introduction</strong> — Present your draft resolution to the committee</li>
                <li><strong>Closing Speech</strong> — Summarize your country&apos;s contributions and call to action</li>
            </ul>

            <h3>Tips for Effective Speeches</h3>
            <ul>
                <li>Start strong with a hook — quote, statistic, or rhetorical question</li>
                <li>Speak clearly and at a measured pace</li>
                <li>Make eye contact with the committee</li>
                <li>Use diplomatic language (&quot;The delegation believes...&quot;)</li>
                <li>End with a clear call to action</li>
            </ul>

            <p><Link href="/mun-guide/">← Back to MUN Guide</Link></p>
        </ContentPage>
    );
}
