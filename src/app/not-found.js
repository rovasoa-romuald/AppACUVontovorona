import Link from 'next/link';

const NotFoundPage = () => {
    return (
        <div className="bg-[url('image404/404.png')] bg-cover bg-center h-screen">
            <div className="flex flex-col items-center justify-end h-screen">
                <div className="flex flex-col items-center justify-end h-screen mb-4">
                    <Link
                        href="/"
                        className="px-4 py-2 text-lg font-semibold text-blue-500 transition-all duration-300 border-2 border-blue-500 rounded-lg hover:text-blue-700 hover:bg-blue-100">
                        Retour a l'acceuil
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
