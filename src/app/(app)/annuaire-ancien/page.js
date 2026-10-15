import Header from '@/app/(app)/Header';
import ElderList from '@/app/(app)/_utils/ElderList';
import FileUploader from '@/app/(app)/_utils/FileUploader';
import { ToastProvider } from '@/contexts/toastContext';
import { AlertProvider } from '@/contexts/alertContext';
import Link from 'next/link';

export const metadata = {
    title: 'ACU - Dashboard',
};

const Dashboard = () => {
    return (
        <ToastProvider>
            <AlertProvider>
                <Header title="Liste des anciens" />
                <div className="py-12">
                    <div className="mx-auto w-[75%] sm:px-6 lg:px-8">
                        <div className="flex items-center justify-center gap-4 px-4 mb-6">
                            <Link
                                href="/espace-ancien/profil"
                                className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600">
                                Ajouter un ancien
                            </Link>
                            <FileUploader />
                        </div>

                        <ElderList />
                    </div>
                </div>
            </AlertProvider>
        </ToastProvider>
    );
};

export default Dashboard;
