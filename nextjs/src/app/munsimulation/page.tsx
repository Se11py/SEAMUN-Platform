import DynamicMunSimulation from './DynamicMunSimulation';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'MUN Simulation | SEAMUNs',
    description: 'Interactive MUN procedural simulation game',
};

export default function MunSimulationPage() {
    return <DynamicMunSimulation />;
}
