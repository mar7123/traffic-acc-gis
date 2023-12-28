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
        <div className="w-full px-[7vw] pt-[4vw]">
            <AddForm />
        </div>
    );
};

export default TambahForm;
