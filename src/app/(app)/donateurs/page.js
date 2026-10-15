import { ToastProvider } from '@/contexts/toastContext';
import DonorManagement from './DonateurManagment';
import { AlertProvider } from '@/contexts/alertContext';

export default function Page() {
    return (
        <AlertProvider>
            <ToastProvider>
                <DonorManagement />
            </ToastProvider>
        </AlertProvider>
    );
}
