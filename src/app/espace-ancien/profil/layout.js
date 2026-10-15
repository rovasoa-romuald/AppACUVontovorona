import MainHeader from '@/components/MainHeader';
import MainFooter from '@/components/MainFooter';

export const metadata = {
    title: 'Mise à jour de la liste des ancien(nes) - ACU Vontovorona',
    canonical: '/profil/ancien',
};

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Header */}
            <MainHeader />
            <div className="antialiased text-gray-900">{children}</div>

            <MainFooter />
        </div>
    );
};

export default Layout;
