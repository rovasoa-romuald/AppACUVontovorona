'use client';
import ApplicationLogo from '@/components/ApplicationLogo';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ThanksModal from './ThanksModal';
import ElderDetailForm from '../../(app)/_utils/ElderDetailForm';
import { useState } from 'react';

const MainElderForm = ({ email = '' }) => {
    const router = useRouter();
    const [isModalThanksOpen, setIsModalThanksOpen] = useState(false);

    const showThanksModal = () => {
        setIsModalThanksOpen(true);
    };
    return (
        <div className="flex flex-col items-center justify-center py-5 bg-gray-100 sm:justify-center sm:pt-0">
            <Link href="/">
                <ApplicationLogo
                    width="200"
                    height="200"
                    className="ml-4 text-gray-500 rounded-full fill-current w-50 h-50 xs:w-12 xs:h-12 bg-gray-50"
                />
            </Link>
            {/* <div className="w-1/2"> */}
            <h1 className="text-center text-2xl font-bold text-[#df1839] mb-2 mx-3">
                Mise à jour de la liste des ancien(nes) - ACU Vontovorona
            </h1>
            <p className="w-2/3 text-base text-center text-gray-600">
                Pour continuer à renforcer nos liens et à cultiver notre
                communauté, nous vous invitons à remplir le formulaire de mise à
                jour de la liste des anciens. Votre participation est
                essentielle pour maintenir notre base de données à jour et pour
                faciliter la communication entre nous. Vos réponses nous
                aideront à mieux vous connaître, à rester en contact et à
                organiser des événements qui répondent à vos besoins et
                intérêts.
            </p>
            {/* </div> */}

            <div className="w-2/3 px-6 py-4 mx-0 mt-6 bg-white shadow-md sm:rounded-lg">
                <ThanksModal
                    isOpen={isModalThanksOpen}
                    onClose={() => {
                        setIsModalThanksOpen(false);
                        router.push('/');
                    }}
                />
                <ElderDetailForm
                    email={email}
                    onCreatedSuccessfully={showThanksModal}
                    skipText="Revenir sur la page d'accueil"
                    onSkip={() => {
                        setIsModalThanksOpen(false);
                        router.push('/');
                    }}
                />
            </div>
        </div>
    );
};

export default MainElderForm;
