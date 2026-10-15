import Link from 'next/link';

const MainFooter = () => {
    return (
        <footer id="contact" className="py-6 mt-auto text-white bg-[#003399]">
            <div className="container mx-auto text-center">
                <p>
                    &copy; 2025 Aumônerie Catholique Universitaire de
                    Vontovorona - Tous droits réservés
                </p>
                <div className="mt-2">
                    <Link
                        href="https://www.facebook.com/profile.php?id=61562173467934"
                        className="text-white hover:underline">
                        Facebook
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default MainFooter;
