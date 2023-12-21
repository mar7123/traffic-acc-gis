import DataComponent from '@/components/Data/DataComponent';
import Breadcrumb from "@/components/Breadcrumbs/BreadcrumbComponent";
import { Metadata } from "next";
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation";


export const metadata: Metadata = {
    title: 'Data | TARGIS',
    description: 'TARGIS is a geographic information system for capturing, storing, checking, and displaying data related to traffic accidents',
}

async function DBPage() {
    const data = await getServerSession();
    if (data) {
        redirect("/database")
    }
    return (
        <div className='flex flex-col items-center min-h-screen h-fit w-full lg:px-[15vw] sm:px-[7vw] lg:py-15 sm:py-10 bg-gray-100'>
            <Breadcrumb pageName="Data" />
            <DataComponent />
        </div>
    );
};
export default DBPage;