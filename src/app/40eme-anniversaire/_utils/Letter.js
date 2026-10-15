const Letter = () => {
    return (
        <div className="max-w-6xl p-8 bg-white border border-gray-100 rounded-lg shadow-xl">
            <div className="mb-8 text-center">
                <h1 className="mb-4 text-2xl font-extrabold text-red-600 text-primary">
                    ANNONCE OFFICIELLE DU JUBILÉ DES 40 ANS DE L'AUMÔNERIE
                    CATHOLIQUE UNIVERSITAIRE SACRÉ-CŒUR DE VONTOVORONA
                </h1>
                <p className="text-lg text-right text-gray-600">
                    Antananarivo, le 11 mars 2025
                </p>
            </div>

            <div className="space-y-6">
                <p className="text-lg text-right text-gray-800">
                    Chers frères et sœurs en Christ,
                    <br />
                    Chers anciens et anciennes, <br />
                    Chers étudiants et membres de l’ACU Vontovorona,
                </p>
                <p className="text-lg text-justify text-gray-700">
                    C'est avec une immense joie que nous vous annonçons
                    officiellement la célébration du Jubilé 2025, marquant le
                    40e anniversaire de l'Aumônerie Catholique Universitaire
                    Sacré-Cœur de Vontovorona. Fondé en 1985, notre centre a été
                    un pilier spirituel et éducatif au sein de l'École
                    Supérieure Polytechnique d'Antananarivo.
                </p>
                <p className="text-lg text-justify text-gray-700">
                    Ce jubilé sera une occasion privilégiée de renouveler notre
                    foi, de raviver l'espérance et de renforcer la charité dans
                    un esprit de communion fraternelle.
                </p>
                <p className="text-lg text-gray-700">
                    Le thème de cette 40e anniversaire s'inspire de la verset
                    biblique 1 Corinthiens 16,14 :{' '}
                    <i>« Que tout ce que vous faites soit avec charité. »</i>
                </p>
                <p className="text-lg text-gray-700">
                    Les objectifs du Jubilé :
                </p>
                <ul className="text-lg list-disc list-inside">
                    <li>
                        Approfondir notre foi et raviver l'espérance chrétienne
                        dans le milieu universitaire,
                    </li>
                    <li>
                        Encourager l'engagement des jeunes dans des actions
                        éducatives et caritatives,
                    </li>
                    <li>
                        Promouvoir une culture de solidarité et d'unité au sein
                        de notre communauté en impliquant tous les personnels
                        universitaire,
                    </li>
                    <li>
                        Ériger une stèle commémorative en l'honneur de cet
                        anniversaire « Plafond ».
                    </li>
                </ul>
                <p className="text-lg text-gray-700">
                    Programme des festivités jubilaire :
                </p>
                <ul className="text-lg list-disc list-inside">
                    <li>
                        {' '}
                        Conférence dans le cadre du thème de la 40e
                        anniversaire,{' '}
                    </li>
                    <li>
                        Kermesse (spectacles artistiques et expositions
                        culturelles) : mettant en valeur les talents de notre
                        communauté,
                    </li>
                    <li>
                        Célébration inaugurale : Le 6 juillet 2025, à 08h00, au
                        Centre Sacré-Cœur de Jésus Vontovorona.
                    </li>
                </ul>
                <p className="text-lg text-gray-700">
                    Dans le cadre des préparatifs de cet événement, plusieurs
                    actions seront mises en place :{' '}
                </p>
                <ul className="text-lg list-disc list-inside">
                    <li>
                        Un recensement des anciens sera effectué afin de les
                        réunir pour cette célébration,
                    </li>
                    <li>
                        {' '}
                        Des invitations seront distribuées pour assurer la
                        mobilisation de toute la communauté,
                    </li>
                    <li>
                        {' '}
                        De plus, une initiative spéciale, appelée « Ezaka Valopy
                        », sera lancée auprès des anciens afin de leur permettre
                        d’apporter leur contribution à la réussite de cet
                        anniversaire,
                    </li>
                    <li>
                        {' '}
                        Le point culminant du jubilé sera la célébration du 40e
                        anniversaire et la pose de la première stèle, « Plafond
                        », un symbole fort de notre engagement et de notre
                        histoire commune.
                    </li>
                </ul>
                <p className="text-lg text-justify text-gray-700">
                    L'organisation de cet événement repose sur un comité
                    structuré à plusieurs niveaux. Il comprend des représentants
                    des étudiants, des chrétiens des alentours ainsi que des
                    anciens, garantissant ainsi une mobilisation large et une
                    organisation efficace des festivités.
                </p>
                <p className="text-lg text-justify text-gray-700">
                    Nous encourageons tous les membres de la communauté à
                    participer activement aux différentes activités. Pour tout
                    information complémentaire, veuillez vous adresser au
                    contact suivant (adresse mail et téléphone)
                </p>
                <p className="text-lg text-justify text-gray-700">
                    Que ce jubilé soit un temps de renouveau spirituel et
                    d'engagement concret au service des autres. Ensemble, vivons
                    pleinement cette année jubilaire comme une lumière pour
                    notre communauté universitaire !
                </p>
                <div className="mt-12 ">
                    <p className="text-lg text-gray-800 ">
                        Dans la paix et la joie du Christ,
                    </p>
                </div>
                <p className="text-lg text-right text-gray-700">
                    L'Aumônerie Catholique Universitaire de Vontovorona
                </p>
            </div>
            <div className="flex justify-center  h-[500px] w-auto mt-4">
                <iframe
                    src={`https://www.youtube.com/embed/MgEhEqMEbs4`}
                    title="YouTube Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                />
            </div>

            <div className="mt-10 text-center">
                <button className="px-6 py-2 text-blue-700 transition duration-300 rounded-full bg-primary hover:bg-primary-dark">
                    Download the Official Letter
                </button>
            </div>
        </div>
    );
};

export default Letter;
