import Header from '@/app/(app)/Header';
import { ToastProvider } from '@/contexts/toastContext';
import { AlertProvider } from '@/contexts/alertContext';
import EnvelopeManagement from '@/app/(app)/_utils/EnvelopeManagement';
export const metadata = {
    title: 'ACU - Dashboard',
};

const Enveloppe = () => {
    return (
        <ToastProvider>
            <AlertProvider>
                <Header title="Liste des enveloppes" />
                <div className="py-12">
                    <div className="mx-auto sm:px-6 lg:px-8">
                        <EnvelopeManagement />
                    </div>
                </div>
            </AlertProvider>
        </ToastProvider>
    );
};

export default Enveloppe;
