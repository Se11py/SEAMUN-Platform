import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'SEAMUNs | Model United Nations in South East Asia',
        short_name: 'SEAMUNs',
        description: 'Track upcoming and previous Model United Nations conferences across South East Asia 🌏',
        start_url: '/',
        display: 'standalone',
        background_color: '#F0F4F8',
        theme_color: '#F0F4F8',
        icons: [
            {
                src: '/assets/seamun-logo.jpg',
                sizes: '512x512',
                type: 'image/jpeg',
            },
        ],
    };
}
