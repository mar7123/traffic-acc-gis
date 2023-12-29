import { Metadata } from "next";
import dynamic from 'next/dynamic'

const AddForm = dynamic(() => import('@/components/Database/AddForm'), { ssr: false });

export const metadata: Metadata = {
    title: "Add Form Page | TRASK",
    description: "TRASK adalah sistem informasi geografis yang memetakan data berkaitan dengan risiko kecelakaan",
    // other metadata
};

const TambahForm = async () => {
    return (
        <div className="flex flex-col items-center min-h-screen h-fit w-full px-[2vw] sm:px-[5vw] lg:px-[10vw] py-5 sm:py-10 lg:py-15 bg-gray-100">
            <AddForm />
        </div>
    );
};

export default TambahForm;
