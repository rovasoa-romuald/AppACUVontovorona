import Link from 'next/link';
import AuthCard from '@/app/(auth)/login/AuthCard';
import ApplicationLogo from '@/components/ApplicationLogo';

export const metadata = {
    title: 'ACU Vontovorona - Login',
    canonical: '/login',
};

const Layout = ({ children }) => {
    return (
        <div>
            <div className="antialiased text-gray-900">
                <AuthCard
                    logo={
                        <Link href="/">
                            <ApplicationLogo
                                width="200"
                                height="200"
                                className="text-gray-500 fill-current w-200 h-200"
                            />
                        </Link>
                    }>
                    {children}
                </AuthCard>
            </div>
        </div>
    );
};

export default Layout;
