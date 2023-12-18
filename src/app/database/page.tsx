import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import WhiteButton from "@/components/Button/WhiteButton";
import TableThree from "@/components/Tables/TableThree";


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
        <div className='flex flex-col items-center min-h-screen h-fit w-full lg:px-[15vw] sm:px-[7vw] lg:py-20 sm:py-10 bg-gray-100'>
            <Breadcrumb pageName="Tables" />
            <div className="flex justify-end mb-6">
                <WhiteButton text="Tambah Data" href="/tables/add" />
            </div>

            <DataComponent />
            <div className="flex flex-col gap-10">
                <TableThree />
            </div>
        </div>
    );
};

export default TablesPage;
