import Header from '@/app/(app)/Header';
import { ToastProvider } from '@/contexts/toastContext';
import { AlertProvider } from '@/contexts/alertContext';
import Recensement from './RecensementManagement';
export const metadata = {
    title: 'ACU - Dashboard',
};

const RecensementUniversitaire = () => {
    return (
        <ToastProvider>
            <AlertProvider>
                <Header title="Récensement des Universitaires" />
                <div className="py-12">
                    <Recensement />
                </div>
            </AlertProvider>
        </ToastProvider>
    );
};

export default RecensementUniversitaire;
