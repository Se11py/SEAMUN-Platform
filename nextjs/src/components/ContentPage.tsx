import Navbar from '@/components/Navbar';
import BackToHomeButton from './BackToHomeButton';
import Breadcrumbs from './Breadcrumbs';

interface ContentPageProps {
    title: string;
    children: React.ReactNode;
}

export default function ContentPage({ title, children }: ContentPageProps) {
    return (
        <>
            <Navbar />

            <main className="main">
                <div className="container content-page-container">
                    <Breadcrumbs items={[
                        { label: 'Home', href: '/' },
                        { label: title },
                    ]} />
                    <BackToHomeButton />
                    <section className="content-page-section">
                        <h2>{title}</h2>
                        {children}
                    </section>
                </div>
            </main>
        </>
    );
}
