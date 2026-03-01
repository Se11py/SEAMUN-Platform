import { MetadataRoute } from 'next';
import { MUN_CONFERENCES_DATA } from '@/lib/conferences-data';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://seamuns.site';

    // Static routes
    const routes = [
        '',
        '/about',
        '/advisor-guide',
        '/awards',
        '/become-participating-school',
        '/chair-guide',
        '/chair-superlatives',
        '/committees',
        '/conduct',
        '/confidence',
        '/crisis',
        '/delegate-signup',
        '/examples',
        '/ga',
        '/how-to-host',
        '/how-to-prep',
        '/individual-delegates',
        '/motions',
        '/mun-guide',
        '/munsimulation',
        '/munsimulation/chairs',
        '/participating-schools',
        '/points',
        '/position-papers',
        '/prospective-muns',
        '/resolutions',
        '/speeches',
        '/stand-out',
        '/support',
        '/templates',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic conference routes
    const conferenceRoutes = MUN_CONFERENCES_DATA.map((conference) => ({
        url: `${baseUrl}/conference/${conference.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    return [...routes, ...conferenceRoutes];
}
