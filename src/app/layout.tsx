import "@/app/globals.css"
import "@/app/data-tables-css.css"
import "@/app/satoshi.css"
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { getServerSession } from 'next-auth/next'
import SessionProvider from '@/components/SessionProvider/SessionProvider';
import RootSessionComponent from "@/components/RootLayout/RootSessionComponent";
import NavbarComponent from "@/components/Navbar/NavbarComponent";
import AdminNavbarComponent from "@/components/Navbar/AdminNavbarComponent";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'RISKA | Sistem Informasi Geografis untuk Pemetaan Risiko Kecelakaan',
    description: 'RISKA adalah sistem informasi geografis yang memetakan data berkaitan dengan risiko kecelakaan',
}

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const server_session = await getServerSession();
    return (
        <html lang="en">
            <body className={inter.className}>
                <SessionProvider session={server_session}>
                    <div className="dark:bg-boxdark-2 dark:text-bodydark">
                        <div className="flex h-screen overflow-hidden">
                            <RootSessionComponent />
                            {server_session ? (
                                <>
                                    <AdminNavbarComponent server_session={server_session}>
                                        <main id="main-component" className="flex flex-grow bg-white">
                                            {children}
                                        </main>
                                    </AdminNavbarComponent>
                                </>
                            ) : (
                                <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                                    <div className='bg-cover bg-black bg-top min-h-fit max-h-screen' style={{ backgroundImage: "url('/assets/bg/bgpfp.jpg')" }}>
                                        <div className='flex flex-col h-full w-full backdrop-brightness-50 bg-black/30'>
                                                <NavbarComponent />
                                        </div>
                                    </div>
                                    <main id="main-component" className="flex flex-grow bg-white">
                                        {children}
                                    </main>
                                </div>
                            )}
                        </div>
                    </div>
                </SessionProvider>
            </body>
        </html>
    )
}
