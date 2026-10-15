import MainHeader from '@/components/MainHeader';
import MainFooter from '@/components/MainFooter';
import Letter from '@/app/40eme-anniversaire/_utils/Letter';
const Page = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Header */}
            <MainHeader />
            <div className="flex items-center justify-center min-h-screen py-4 bg-gray-50">
                <Letter />
            </div>
            <MainFooter />
        </div>
    );
};

export default Page;
