import Header from '@/app/(app)/Header';
import { ToastProvider } from '@/contexts/toastContext';
import { AlertProvider } from '@/contexts/alertContext';
import Cards from './Cards';

export const metadata = {
    title: 'ACU - Dashboard',
};

const Dashboard = () => {
    return (
        <ToastProvider>
            <AlertProvider>
                <Header title="Tableau de bord" />
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Cards />
                </div>
            </AlertProvider>
        </ToastProvider>
    );
};

export default Dashboard;
