/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || 'https://tracker.seamuns.org',
    generateRobotsTxt: true,
    exclude: ['/server-sitemap.xml', '/admin/*'],
    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin', '/api'],
            },
        ],
        additionalSitemaps: [
            `${process.env.SITE_URL || 'https://tracker.seamuns.org'}/server-sitemap.xml`,
        ],
    },
};
