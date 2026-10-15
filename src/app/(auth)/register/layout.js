export const metadata = {
    title: 'Laravel',
};

const Layout = ({ children }) => {
    return (
        <div>
            <div className="antialiased text-gray-900">
                <div className="flex flex-col items-center min-h-screen pt-6 bg-gray-100 sm:justify-center sm:pt-0">
                    <div className="w-1/2">
                        <h1 className="text-center text-2xl font-bold text-[#df1839] mb-2">
                            Mise à jour de la liste des ancien(nes) - ACU
                            Vontovorona
                        </h1>
                        <p className="text-base text-center text-gray-600">
                            Pour continuer à renforcer nos liens et à cultiver
                            notre communauté, nous vous invitons à remplir le
                            formulaire de mise à jour de la liste des anciens.
                            Votre participation est essentielle pour maintenir
                            notre base de données à jour et pour faciliter la
                            communication entre nous. Vos réponses nous aideront
                            à mieux vous connaître, à rester en contact et à
                            organiser des événements qui répondent à vos besoins
                            et intérêts.
                        </p>
                    </div>

                    <div className="min-w-[100vh] px-6 py-4 mt-6 bg-white shadow-md sm:max-w-md sm:rounded-lg">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Layout;
