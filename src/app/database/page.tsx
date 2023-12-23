import Breadcrumb from "@/components/Breadcrumbs/BreadcrumbComponent";
import { Metadata } from "next";
import DataComponent from "@/components/Data/DataComponent";

export const metadata: Metadata = {
    title: "Tables Page | Next.js E-commerce Dashboard Template",
    description: "This is Tables page for TailAdmin Next.js",
    // other metadata
};

const TablesPage = async () => {
    return (
        <div className='flex flex-col items-center min-h-screen h-fit w-full bg-gray-100'>
            <div className='flex flex-col items-center max-w-screen-2xl mx-auto h-full w-full px-[4vw] sm:px-[7vw] lg:px-[15vw] py-5 sm:py-10 lg:py-15'>
                <Breadcrumb pageName="Database" />
                <DataComponent />
            </div>
        </div>
    );
};

export default TablesPage;
