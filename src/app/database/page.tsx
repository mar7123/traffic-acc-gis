import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/BreadcrumbComponent";
import { Metadata } from "next";
import DataComponent from "@/components/Data/DataComponent";
export const metadata: Metadata = {
    title: "Tables Page | Next.js E-commerce Dashboard Template",
    description: "This is Tables page for TailAdmin Next.js",
    // other metadata
};

const TablesPage = async () => {
    const data = await getServerSession();
    if (!data) {
        redirect("/")
    }
    return (
        <div className='flex flex-col items-center min-h-screen h-fit w-full lg:px-[10vw] sm:px-[5vw] lg:py-15 sm:py-10 bg-gray-100'>
            <Breadcrumb pageName="Database" />
            <DataComponent />
        </div>
    );
};

export default TablesPage;
