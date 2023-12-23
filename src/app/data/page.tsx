import DataComponent from '@/components/Data/DataComponent';
import Breadcrumb from "@/components/Breadcrumbs/BreadcrumbComponent";
import { Metadata } from "next";
import { getServerSession } from "next-auth/next"
import { permanentRedirect } from "next/navigation";


export const metadata: Metadata = {
    title: 'Data | TARGIS',
    description: 'TARGIS is a geographic information system for capturing, storing, checking, and displaying data related to traffic accidents',
}

async function DBPage() {
    const data = await getServerSession();
    if (data) {
        permanentRedirect("/database")
    }
    return (
        <div className='flex flex-col items-center min-h-screen h-fit w-full bg-gray-100'>
            <div className='flex flex-col items-center max-w-screen-2xl mx-auto h-full w-full px-[4vw] sm:px-[7vw] lg:px-[15vw] py-5 sm:py-10 lg:py-15'>
                <Breadcrumb pageName="Data" />
                <DataComponent />
            </div>
        </div>
    );
};
export default DBPage;