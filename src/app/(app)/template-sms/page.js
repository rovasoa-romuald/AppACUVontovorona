import { ToastProvider } from '@/contexts/toastContext';
import { AlertProvider } from '@/contexts/alertContext';
import SMSTemplateManager from './SMSTemplateManager';
export const metadata = {
    title: 'ACU - Dashboard',
};

const Page = () => {
    return (
        <ToastProvider>
            <AlertProvider>
                <SMSTemplateManager />
            </AlertProvider>
        </ToastProvider>
    );
};

export default Page;
