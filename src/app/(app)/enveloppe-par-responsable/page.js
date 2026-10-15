import EnvelopePerResponsible from '../_utils/EnvelopePerResponsible';
import Header from '@/app/(app)/Header';
import { ToastProvider } from '@/contexts/toastContext';
import { AlertProvider } from '@/contexts/alertContext';

export default function Page() {
    // You may want to fetch statusOptions from API or define statically

    return (
        <ToastProvider>
            <AlertProvider>
                <div className="p-4">
                    <Header title="Listing des enveloppes groupées par responsable" />
                    <div className="py-12">
                        <div className="mx-auto sm:px-6 lg:px-8">
                            <EnvelopePerResponsible />
                        </div>
                    </div>
                </div>
            </AlertProvider>
        </ToastProvider>
    );
}
