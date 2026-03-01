'use client';

import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';
import ContentPage from '@/components/ContentPage';

// SwaggerUI requires window object (classic React SPA wrapper).
const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function ApiDocs() {
    return (
        <ContentPage title="🔧 API Documentation">
            <div style={{
                background: 'white',
                padding: '1rem',
                borderRadius: '8px',
                overflow: 'hidden'
            }}>
                <SwaggerUI url="/openapi.yaml" />
            </div>
        </ContentPage>
    );
}
