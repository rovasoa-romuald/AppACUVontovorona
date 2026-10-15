import EnvelopeByWeekList from '../_utils/EnvelopeByWeekList';
import Header from '@/app/(app)/Header';
import { ToastProvider } from '@/contexts/toastContext';
import { AlertProvider } from '@/contexts/alertContext';

export default function Page() {
    return (
        <ToastProvider>
            <AlertProvider>
                <div className="p-4">
                    <Header title="Listing des enveloppes par semaine" />
                    <div className="py-12">
                        <div className="mx-auto sm:px-6 lg:px-8">
                            <EnvelopeByWeekList />
                        </div>
                    </div>
                </div>
            </AlertProvider>
        </ToastProvider>
    );
}
