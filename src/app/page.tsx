import DashboardComponent from "@/components/Dashboard/DashboardComponent";
import LandingComponent from "@/components/LandingPage/LandingComponent";
import { Metadata } from "next";
import { getServerSession } from "next-auth/next"

export const metadata: Metadata = {
    title: 'TARGIS | Traffic Accident Risk GIS',
    description: 'TARGIS is a geographic information system for capturing, storing, checking, and displaying data related to traffic accidents',
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
