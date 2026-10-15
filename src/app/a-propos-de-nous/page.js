'use client';

import MainFooter from '@/components/MainFooter';
import MainHeader from '@/components/MainHeader';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutUs() {
    const sections = [
        {
            title: 'Qui sommes-nous ?',
            content: "Nous sommes une communauté religieuse issue de l'ECAR.",
            image: '/fmj.png',
            link: '/',
        },
        {
            title: 'Notre histoire',
            content:
                'Apprenez un peu plus sur notre histoire depuis ces 40 ans.',
            image: '/fmj.png',
            link: '/',
        },
        {
            title: 'Nos Membres',
            content:
                "Les étudiants, les PAT et les enseignants au sein de l'ESPA.",
            image: '/fmj.png',
            link: '/',
        },
        {
            title: 'Nos activités',
            content: 'Apprenez tout sur nos activités.',
            image: '/fmj.png',
            link: '/',
        },
        {
            title: 'Adhésion',
            content: "Découvrez comment rejoindre l'ACUT Centre Vontovorona.",
            image: '/fmj.png',
            link: '/',
        },
        {
            title: 'Le Centre',
            content:
                'Les salles pour vos activités religieuses et académiques.',
            image: '/fmj.png',
            link: '/',
        },
    ];

    return (
        <div className="flex flex-col min-h-screen ">
            <MainHeader />
            <div className="w-full ">
                {/* Section avec fond bleu pour le titre et la description */}
                <div className="relative grid max-w-6xl grid-cols-1 gap-6 mx-auto mt-10 sm:grid-cols-2 md:grid-cols-3">
                    <div className="md:col-span-3 text-[#1E3A8A] flex justify-between">
                        <div>
                            <h1 className="text-5xl font-bold">
                                À propos de nous
                            </h1>
                            <p className="mt-2 text-lg">
                                Tout ce que vous devez savoir sur l’Aumônerie
                                Catholique Universitaire de Vontovorona.
                            </p>
                        </div>
                        <Image
                            src={'/coeur.png'}
                            alt="logo"
                            width={70} // Largeur
                            height={20} // Hauteur = Largeur / 3
                            className="object-cover rounded-lg"
                        />
                    </div>
                    {sections.map((section, index) => (
                        <Link key={index} href={section.link} className="group">
                            <div className="px-4 pb-4  rounded-3xl border-8 bg-[#1E3A8A] border-[#E5E7EB] shadow-xl text-center flex flex-col items-center h-[300px] transition-transform transform group-hover:scale-105">
                                {/* Fond bleu pour la partie titre */}
                                <div className="w-full p-4 text-white ">
                                    <p className="block text-xl font-bold">
                                        {section.title}
                                    </p>
                                </div>
                                <div className="w-full h-full bg-white border-b-8 border-x-8 border-x-[#E5E7EB] border-b-[#E5E7EB] rounded-b-2xl ">
                                    <p className="px-4 pt-4 text-sm ">
                                        {section.content}
                                    </p>
                                    {section.image && (
                                        <div className="flex justify-center w-full mt-auto">
                                            <Image
                                                src={section.image}
                                                alt={section.title}
                                                width={210} // Largeur
                                                height={70} // Hauteur = Largeur / 3
                                                className="object-cover rounded-lg"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <MainFooter />
        </div>
    );
}
