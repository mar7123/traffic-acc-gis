import DataComponent from '@/components/Data/DataComponent';
import Breadcrumb from "@/components/Breadcrumbs/BreadcrumbComponent";
import { Metadata } from "next";
import { getServerSession } from "next-auth/next"
import { permanentRedirect } from "next/navigation";


export const metadata: Metadata = {
    title: 'Data | TRASK',
    description: 'TRASK adalah sistem informasi geografis yang memetakan data berkaitan dengan risiko kecelakaan',
}

async function DBPage() {
    const data = await getServerSession();
    if (data) {
        permanentRedirect("/database")
    }
    return (
        <div className='flex flex-col items-center min-h-screen h-fit w-full bg-gray-100'>
            <div className='flex flex-col items-center max-w-screen-2xl mx-auto h-full w-full px-[2vw] sm:px-[5vw] lg:px-[10vw] py-5 sm:py-10 lg:py-15'>
                <Breadcrumb pageName="Data" />
                <DataComponent />
            </div>
        </div>
    );
};
export default DBPage;