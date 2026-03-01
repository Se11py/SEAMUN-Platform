'use client';

import dynamic from 'next/dynamic';

const MunSimulation = dynamic(() => import('./MunSimulation'), {
    loading: () => <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Game Engine...</div>,
    ssr: false
});

export default function DynamicMunSimulation() {
    return <MunSimulation />;
}
