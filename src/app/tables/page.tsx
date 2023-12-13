import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import WhiteButton from "@/components/Button/WhiteButton";
import TableThree from "@/components/Tables/TableThree";


import { Metadata } from "next";
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
        <>
            <div className="w-full px-[7vw] pt-[4vw]">
                <Breadcrumb pageName="Tables" />
                <div className="flex justify-end mb-6">
                    <WhiteButton text="Tambah Data" href="/tables/add" />
                </div>
                <div className="flex flex-col gap-10">
                    <TableThree />
                </div>
            </div>
        </>
    );
};

export default TablesPage;
