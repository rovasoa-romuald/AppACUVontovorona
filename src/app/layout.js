import { Roboto } from 'next/font/google';
import '@/app/global.css';

const robotoFont = Roboto({
    weight: ['400', '700'], // single weight to avoid runtime error
    subsets: ['latin'],
    display: 'swap',
});

const RootLayout = ({ children }) => {
    return (
        <html lang="en" className={robotoFont.className}>
            <body className="antialiased">{children}</body>
        </html>
    );
};

export const metadata = {
    title: 'ACU Vontovorona - 40 ans',
    description:
        "L'Aumônerie Catholique Universitaire de Vontovorona est un lieu consacré à la vie spirituelle, culturelle et communautaire des jeunes universitaires et des chrétiens catholiques de la région de Vontovorona.",
    canonical: '/',
    icon: '/favicon.ico',
};

export default RootLayout;
