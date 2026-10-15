'use client';
import Image from 'next/image';
import MainHeader from '@/components/MainHeader';
import { useEffect, useState } from 'react';

export default function BibleVerse() {
    const [showDecorative, setShowDecorative] = useState(false);
    // Track which event item is currently expanded (null means all collapsed)
    const [openItemIdx, setOpenItemIdx] = useState(0);

    const homeData = [
        {
            title: 'Évènements et Actualités',
            items: [
                {
                    subTitle: 'Messes',
                    description:
                        'La messe est le centre de notre vie chrétienne. À l’ACU Vontovorona, des messes sont célébrées régulièrement pour accompagner les étudiants tout au long de l’année universitaire. Consultez les horaires, les lieux de célébration, ainsi que les temps forts liturgiques (messes spéciales, fêtes religieuses, messes d’action de grâce, etc.).',
                },
                {
                    subTitle: 'Rosaire',
                    description:
                        'La prière du Rosaire est au cœur de notre vie spirituelle. Prié régulièrement en groupe, il nous unit dans la méditation des mystères du Christ et nous rapproche de la Vierge Marie. Retrouvez ici les prochaines dates de récitation communautaire, les intentions de prière, ainsi que des ressources pour nourrir votre vie de prière personnelle.',
                },
                {
                    subTitle: 'Activités culturelles',
                    description:
                        'L’ACU Vontovorona est aussi un espace d’expression culturelle. Tout au long de l’année, des événements sont organisés pour promouvoir les talents, les traditions et la créativité de nos membres. Restez informé des prochaines soirées culturelles, expositions, concerts, projections de films et autres événements enrichissants qui font vivre notre communauté.',
                },
                {
                    subTitle:
                        'Retour sur le 40ème Anniversaire de l’ACU Vontovorona',
                    description:
                        'L’année écoulée a marqué un moment fort pour notre communauté : la célébration du 40ème anniversaire de l’Aumônerie Catholique Universitaire de Vontovorona. Ce jubilé a été l’occasion de rendre grâce pour quatre décennies de foi, d’engagement et de fraternité. Revivez les temps forts à travers des témoignages, des galeries photos, des vidéos et les discours marquants qui ont ponctué cette célébration mémorable.',
                },
            ],
        },
    ];

    useEffect(() => {
        const updateShow = () => {
            // Show decorative elements only when width is more than twice the height
            setShowDecorative(window.innerWidth > window.innerHeight * 2);
        };
        updateShow(); // initial check on mount
        window.addEventListener('resize', updateShow);
        return () => window.removeEventListener('resize', updateShow);
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <MainHeader />

            {/* Page originale pour lg et plus */}
            <div
                className={`relative px-4 pb-16 h-screen overflow-y-auto bg-white lg:block ${!showDecorative ? 'bg-[url(/Centre.jpeg)] bg-opacity-20 bg-cover bg-center' : ''}`}>
                {/* Verse + Reference */}
                <div
                    className="mt-4 w-full"
                    style={{
                        color: `${showDecorative ? '#003399' : '#fff'}`,
                    }}>
                    <div className="inline-block py-4 text-center md:pl-4">
                        <p className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl verse-reference sm:text-center md:text-center lg:text-left">
                            «Que tout ce que vous faites se fasse avec Charité!»
                        </p>
                        <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl verse-reference">
                            1 Cor 16:14
                        </p>
                    </div>
                </div>

                {/* Red banner: Qui sommes-nous */}
                <div className="relative z-50 mt-4 ml-4 w-full max-w-full">
                    <div className="2xl:w-[60%] p-2 text-2xl sm:text-3xl font-bold text-white bg-gradient-to-r from-red-600 to-transparent shadow-md">
                        Qui sommes-nous?
                    </div>
                </div>

                {/* Split sentence in 2 lines */}
                <div
                    className="mt-4 ml-4 text-base font-semibold leading-snug sm:text-lg md:text-xl lg:text-md"
                    style={{ color: '#003399' }}>
                    <p>
                        L'Aumônerie Catholique Universitaire de Vontovorona{' '}
                        <br />
                        est un espace dédié à la vie spirituelle et
                        communautaire des universitaires et des chrétiens de
                        Vontovorona et ses alentours.
                        <br />
                    </p>
                </div>

                {homeData.map(itemHome => (
                    <div key={itemHome.title}>
                        {/* Red banner: Evènements et Actualités */}
                        <div className="relative z-50 mt-4 ml-4 w-full max-w-full">
                            <div className="2xl:w-[60%] p-2 text-2xl font-bold text-white bg-gradient-to-r from-red-600 to-transparent shadow-md">
                                {itemHome.title}
                            </div>
                        </div>

                        {/* Dropdown feature */}
                        {itemHome.items.map((itm, idx) => (
                            <div
                                key={idx}
                                className="relative z-20 mt-4 ml-4 w-full max-w-full">
                                <div className="2xl:w-[60%] overflow-hidden ">
                                    {/* Title Bar */}
                                    <div
                                        onClick={() =>
                                            setOpenItemIdx(
                                                openItemIdx === idx
                                                    ? null
                                                    : idx,
                                            )
                                        }
                                        className="flex items-center px-5 py-2 text-white rounded-l-full shadow-md cursor-pointer"
                                        style={{
                                            backgroundImage:
                                                'linear-gradient(to right, #003399, transparent)',
                                        }}>
                                        <span className="mr-2 text-2xl font-extrabold tracking-wide sm:text-lg">
                                            {itm.subTitle}
                                        </span>
                                        <svg
                                            width="22"
                                            height="18"
                                            viewBox="0 0 22 18"
                                            className={`ml-1 transition-transform duration-200 ${openItemIdx === idx ? 'rotate-90' : ''}`}>
                                            <polygon
                                                points="0,0 22,9 0,18"
                                                fill="#fff"
                                                fillOpacity="0.4"
                                            />
                                        </svg>
                                    </div>

                                    {/* Content Box */}
                                    <div
                                        className={`px-6 py-4 ml-6 text-white shadow-md transition-all duration-300 overflow-hidden ${openItemIdx === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                                        style={{
                                            backgroundImage:
                                                'linear-gradient(to right, #003399, transparent)',
                                        }}>
                                        {/* 2XL and up: cleaner paragraph version */}
                                        <div className="w-[60%]">
                                            <p className="text-lg font-bold leading-snug">
                                                {itm.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            {/* PNG image aligned to bottom-right */}
            {showDecorative && (
                <Image
                    src="/FiangonanaJaunebleu.svg"
                    alt="Decorative"
                    className="absolute right-0 -bottom-20 z-30 w-[55%] "
                    width={600}
                    height={800}
                    id="fiangonanaImage"
                />
            )}

            {/* Bottom-left SVG */}
            {showDecorative && (
                <Image
                    src="/deco-button.png"
                    alt="Decorative left corner"
                    className="absolute left-0 -bottom-20 z-0 w-3/4"
                    style={{ transformOrigin: 'left' }}
                    width={500}
                    height={500}
                    id="decoButtonImage"
                />
            )}
            {/* Footer banner - caché sur sm et md */}
            <div className="hidden fixed bottom-0 left-0 z-50 py-2 w-full text-center bg-white lg:block">
                <p
                    className="text-sm font-semibold"
                    style={{ color: '#003399' }}>
                    © Copyright ACU Vontovorona 2025
                </p>
            </div>
        </div>
    );
}
