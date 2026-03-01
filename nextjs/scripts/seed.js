require('dotenv').config({ path: '.env.local' });
const { Client } = require('@neondatabase/serverless');

async function main() {
    if (!process.env.DATABASE_URL) {
        console.error('Error: DATABASE_URL is not set');
        process.exit(1);
    }

    const client = new Client(process.env.DATABASE_URL);

    try {
        await client.connect();
        console.log('Connected to database for seeding...');

        // Verify if data exists
        const { rows } = await client.query('SELECT count(*) FROM conferences');
        if (parseInt(rows[0].count) > 0) {
            console.log('Data already exists, skipping seed.');
            await client.end();
            return;
        }

        console.log('Seeding conferences...');

        // MUN07 IV
        await client.query(`
            INSERT INTO conferences (
                conference_id, name, organization, location, country_code, start_date, end_date, 
                description, website, registration_deadline, position_paper_deadline, status, 
                size, general_email, mun_account, advisor_account, sec_gen_accounts, 
                parliamentarian_accounts, price_per_delegate, independent_dels_welcome, 
                independent_signup_link, advisor_signup_link, disabled_suitable, 
                sensory_suitable, schedule, venue_guide, extra_notes
            ) VALUES (
                1,
                'MUN07 IV',
                'St Andrews International School, Sukhumvit 107',
                'Bangkok, Thailand',
                'TH',
                '2026-03-07',
                '2026-03-07',
                'The fourth annual MUN07 conference at St Andrews International School Sukhumvit 107, featuring 10 diverse committees including specialized bodies and regional organizations.',
                'https://mun07.org',
                '2026-02-07',
                '2026-02-14',
                'upcoming',
                '250+ attendees',
                'mun07sta@gmail.com',
                '@mun07',
                'mun07sta@gmail.com',
                'PJ (@janekij_) and Poon (@natthawit._)',
                'Contact via mun07sta@gmail.com',
                '900 THB',
                TRUE,
                'https://forms.gle/cwyjPqszetrQGaNN8',
                'https://forms.gle/xKSp8oSejzXDE6gV7',
                TRUE,
                TRUE,
                '<p><strong>March 7, 2026:</strong> Full Day Conference - Opening Ceremony, Committee Sessions, Closing Ceremony</p>',
                '<p>Conference held at St Andrews International School, Sukhumvit 107 campus. Wheelchair accessible with access ramps available.</p>',
                '<p>Business attire required. 10 specialized committees including UNHRC, UNSC, UNOOSA, SPECPOL, DISEC, USCC, INTERPOL, ICJ, ASEAN, and Press Corps. <strong>Accessibility:</strong> Wheelchair accessible with ramps available. Sensory-friendly with break room available for delegates who need it. Delegate fee: 900 THB. Follow us on Instagram: @mun07 for updates. Secretary Generals: PJ (@janekij_) and Poon (@natthawit._)</p>'
            )
        `);

        console.log('Seeding committees...');
        await client.query(`
            INSERT INTO committees (conference_id, name, topic, chair_info) VALUES
            (1, 'UNHRC', 'The Question of Human Rights Abuses in Detention Centres and Prisons in The United States', 'Head Chair: Tamara (@__.t.petrosyan.__), Deputy Chair: Anai (@anai._.ona)'),
            (1, 'UNSC', 'The Question of Preventing Escalation in the Taiwan Strait between Taiwan and China', 'Head Chair: Flo (@flo.walker.1), Deputy Chair: Agrim (@agrimdaga)'),
            (1, 'UNOOSA', 'The Question of Preventing the Weaponisation of Satellites in Outer Space', 'Head Chair: Rose (@roslyn.ry), Deputy Chair: Tenzin (@tenzinyangring)'),
            (1, 'SPECPOL', 'The Question of International Oversight in Yemen''s Political Transition with an emphasis on the Houthi Terror Organisation', 'Head Chair: Kirill (@krlse23), Deputy Chair: Hayeon (@hayeonnkk)'),
            (1, 'DISEC', 'The Question of the Use of Drones in Modern Warfare with an emphasis on The Ukraine-Russia War', 'Head Chair: Vicka (@vicka.w), Deputy Chair: Myesha (@nidhika_s)'),
            (1, 'USCC', 'The Question of the Use of the National Guard as a Domestic Policing Force on US Soil', 'President: Aimie (@aimiea_), Vice President: Budh (@budhman1234)'),
            (1, 'INTERPOL', 'The Question of Combating Human Trafficking Networks Along Western Europe with an emphasis on Paris', 'President: Pund (@pundthepond), Vice President: Ryu (@kior.yu)'),
            (1, 'ICJ', 'The Question of the Jorge Glas Dispute in Ecuador v. Mexico', 'President: Celia (@thatburmesegal), Vice President: Veda (@v3dx_2204)'),
            (1, 'ASEAN', 'The Question of Solving the Conflict Between Thailand and Cambodia', 'Head Chair: Dominic (@dominic_mll), Deputy Chair: Sanvi (@sanvi_k30)'),
            (1, 'Press Corps', 'The Question of Combatting Fake News and Disinformation Internationally', 'Editor in Chief: Su Hyun (@vampyrculture or 28suhyun@regents.ac.th), Editor: Lineysha')
        `);

        // Allocations (simplified for seed)
        await client.query(`
            INSERT INTO allocations (conference_id, country) VALUES
            (1, 'Thailand'), (1, 'Singapore'), (1, 'Malaysia'), (1, 'Vietnam'), (1, 'Indonesia')
        `);

        // Available Awards
        await client.query(`
             INSERT INTO available_awards (conference_id, award_name) VALUES
            (1, 'Best Delegate'), (1, 'Outstanding Delegate'), (1, 'Honorable Mention')
        `);

        console.log('✅ Seeding completed!');
        await client.end();

    } catch (error) {
        console.error('❌ Seeding failed:', error);
        await client.end();
        process.exit(1);
    }
}

main();
