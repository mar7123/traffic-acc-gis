import DashboardComponent from "@/components/Dashboard/DashboardComponent";
import LandingComponent from "@/components/LandingPage/LandingComponent";
import { Metadata } from "next";
import { getServerSession } from "next-auth/next"

export const metadata: Metadata = {
    title: 'TRASK | Sistem Informasi Geografis untuk Pemetaan Risiko Kecelakaan',
    description: 'TRASK adalah sistem informasi geografis yang memetakan data berkaitan dengan risiko kecelakaan',
}

export default async function Home() {
    const session = await getServerSession();
    return (
        <>
            {session ? (
                <DashboardComponent />
            ) : (
                <LandingComponent />
            )}
        </>
    )
}
