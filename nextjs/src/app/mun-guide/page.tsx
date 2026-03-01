import ContentPage from '@/components/ContentPage';
import Link from 'next/link';

export default function MunGuidePage() {
    return (
        <ContentPage title="📖 MUN Guide">
            <p>A short overview of Model UN and how to use SEAMUNs.</p>

            <h3>🌐 What is MUN?</h3>
            <p>Model United Nations (MUN) is a simulation where students take on the role of delegates representing countries or characters. They debate topics, negotiate, write resolutions, and follow rules of procedure similar to the real UN.</p>

            <h3>🚀 Getting started</h3>
            <ul>
                <li><strong>Find conferences</strong> — Use <Link href="/">Upcoming &amp; Previous MUNs</Link> to see conferences; open one for dates, fees, committees, and signup links.</li>
                <li><strong>Prepare</strong> — Read the topic, research your country&apos;s position, and write a position paper if required. See <Link href="/how-to-prep/">How to Prep</Link> and <Link href="/position-papers/">Position Papers</Link>.</li>
                <li><strong>Procedure</strong> — Learn points, motions, and resolutions: <Link href="/points/">Points</Link>, <Link href="/motions/">Motions</Link>, <Link href="/resolutions/">Resolutions</Link>, <Link href="/speeches/">Speeches</Link>.</li>
            </ul>

            <h3>On this site</h3>
            <p>Use the navigation to explore <strong>Conferences</strong>, <strong>Schools &amp; Advisors</strong>, <strong>Delegates &amp; Chairs</strong>, and <strong>Resources</strong>. For procedure practice, try the <Link href="/munsimulation/" target="_blank" rel="noopener noreferrer">MUN Simulation Game</Link>.</p>
        </ContentPage>
    );
}
