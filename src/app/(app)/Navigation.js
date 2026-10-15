import ApplicationLogo from '@/components/ApplicationLogo';
import Dropdown from '@/components/Dropdown';
import Link from 'next/link';
import NavLink from '@/components/NavLink';
import ResponsiveNavLink, {
    ResponsiveNavButton,
} from '@/components/ResponsiveNavLink';
import { DropdownButton } from '@/components/DropdownLink';
import { useAuth } from '@/hooks/auth';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const Navigation = ({ user }) => {
    const { logout } = useAuth();

    const [open, setOpen] = useState(false);

    return (
        <nav className="bg-white border-b border-gray-100">
            {/* Primary Navigation Menu */}
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        {/* Logo */}
                        <div className="flex flex-shrink-0 items-center">
                            <Link href="/">
                                <ApplicationLogo
                                    width="50"
                                    height="50"
                                    className="block w-auto h-10 text-gray-600 fill-current"
                                />
                            </Link>
                        </div>

                        {/* Navigation Links */}
                        <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                            <NavLink
                                href="/dashboard"
                                active={usePathname() === '/dashboard'}>
                                Dashboard
                            </NavLink>
                            <NavLink
                                href="/annuaire-ancien"
                                active={usePathname() === '/annuaire-ancien'}>
                                Annuaire des anciens
                            </NavLink>
                            <NavLink
                                href="/enveloppe-40eme"
                                active={usePathname() === '/enveloppe-40eme'}>
                                Enveloppe jubilé (40eme)
                            </NavLink>
                            <NavLink
                                href="/enveloppe-par-responsable"
                                active={
                                    usePathname() ===
                                    '/enveloppe-par-responsable'
                                }>
                                Liste d'enveloppes groupées par responsable
                            </NavLink>
                            <NavLink
                                href="/enveloppe-par-semaine"
                                active={
                                    usePathname() === '/enveloppe-par-semaine'
                                }>
                                Rapport hebdomadaire
                            </NavLink>
                            <NavLink
                                href="/recensement-universitaire"
                                active={
                                    usePathname() ===
                                    '/recensement-universitaire'
                                }>
                                Recensement universitaire
                            </NavLink>
                            <NavLink
                                href="/template-sms"
                                active={usePathname() === '/template-sms'}>
                                SMS Manager
                            </NavLink>
                            <NavLink
                                className="bg-blue-300"
                                href="/donateurs"
                                active={usePathname() === '/donateurs'}>
                                Donateurs
                            </NavLink>
                        </div>
                    </div>

                    {/* Settings Dropdown */}
                    <div className="hidden sm:flex sm:items-center sm:ml-6">
                        <Dropdown
                            align="right"
                            width="48"
                            trigger={
                                <button className="flex items-center text-sm font-medium text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none">
                                    <div>{user?.name}</div>

                                    <div className="ml-1">
                                        <svg
                                            className="w-4 h-4 fill-current"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                </button>
                            }>
                            {/* Authentication */}
                            <DropdownButton onClick={logout}>
                                Logout
                            </DropdownButton>
                        </Dropdown>
                    </div>

                    {/* Hamburger */}
                    <div className="flex items-center -mr-2 sm:hidden">
                        <button
                            onClick={() => setOpen(open => !open)}
                            className="inline-flex justify-center items-center p-2 text-gray-400 rounded-md transition duration-150 ease-in-out hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500">
                            <svg
                                className="w-6 h-6"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 24 24">
                                {open ? (
                                    <path
                                        className="inline-flex"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        className="inline-flex"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Responsive Navigation Menu */}
            {open && (
                <div className="block sm:hidden">
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink
                            href="/dashboard"
                            active={usePathname() === '/dashboard'}>
                            Dashboard
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href="/annuaire-ancien"
                            active={usePathname() === '/annuaire-ancien'}>
                            Annuaire des anciens
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href="/enveloppe-40eme"
                            active={usePathname() === '/enveloppe-40eme'}>
                            Enveloppe jubilé (40eme)
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href="/enveloppe-par-responsable"
                            active={
                                usePathname() === '/enveloppe-par-responsable'
                            }>
                            Liste d'enveloppes groupées par responsable
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href="/enveloppe-par-semaine"
                            active={usePathname() === '/enveloppe-par-semaine'}>
                            Rapport hebdomadaire
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href="/recensement-universitaire"
                            active={
                                usePathname() === '/recensement-universitaire'
                            }>
                            Récensement universitaire
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href="/template-sms"
                            active={usePathname() === '/template-sms'}>
                            SMS Manager
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href="/donateurs"
                            active={usePathname() === '/donateurs'}>
                            Donateurs
                        </ResponsiveNavLink>
                    </div>

                    {/* Responsive Settings Options */}
                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="flex items-center px-4">
                            <div className="flex-shrink-0">
                                <svg
                                    className="w-10 h-10 text-gray-400 fill-current"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                            </div>

                            <div className="ml-3">
                                <div className="text-base font-medium text-gray-800">
                                    {user?.name}
                                </div>
                                <div className="text-sm font-medium text-gray-500">
                                    {user?.email}
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            {/* Authentication */}
                            <ResponsiveNavButton onClick={logout}>
                                Logout
                            </ResponsiveNavButton>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navigation;
