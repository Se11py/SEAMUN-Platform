import { SignUp } from '@clerk/nextjs';
import BackToHomeButton from '@/components/BackToHomeButton';

export default function SignUpPage() {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-primary, #f8fafc)',
            padding: '2rem',
            flexDirection: 'column',
            gap: '2rem',
        }}>
            <BackToHomeButton />
            <SignUp />
        </div>
    );
}
