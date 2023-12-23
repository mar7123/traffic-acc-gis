import { Metadata } from "next";
import dynamic from 'next/dynamic'

const AddForm = dynamic(() => import('@/components/GeoData/AddForm'), { ssr: false });

export const metadata: Metadata = {
    title: "Form Layout Page | Next.js E-commerce Dashboard Template",
    description: "This is Form Layout page for TailAdmin Next.js",
    // other metadata
};

const TambahForm = async () => {
    return (
        <div className="w-full px-[7vw] pt-[4vw]">
            <AddForm />
        </div>
    );
};

export default TambahForm;
