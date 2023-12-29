import { Metadata } from "next";
import { getGeoDataByID } from "@/lib/prisma/geodata";
import EditForm from "@/components/Database/EditForm";

export const metadata: Metadata = {
    title: "Edit Form | TRASK",
    description: "TRASK adalah sistem informasi geografis yang memetakan data berkaitan dengan risiko kecelakaan",
    // other metadata
};

const EditFormPage = async ({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) => {
    if (typeof (searchParams.id) == "string") {
        const { res } = await getGeoDataByID(searchParams.id);
        if (res) {
            return (
                <div className="flex flex-col items-center min-h-screen h-fit w-full px-[2vw] sm:px-[5vw] lg:px-[10vw] py-5 sm:py-10 lg:py-15 bg-gray-100">
                    <EditForm data={res} />
                </div>
            )
        }
    }
};

export default EditFormPage;
