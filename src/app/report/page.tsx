import Breadcrumb from "@/components/Breadcrumbs/BreadcrumbComponent";
import { Metadata } from "next";
import ReportDataComponent from "@/components/Report/ReportDataComponent";

export const metadata: Metadata = {
    title: "Database Page | TRASK",
    description: "TRASK adalah sistem informasi geografis yang memetakan data berkaitan dengan risiko kecelakaan",
    // other metadata
};

const ReportPage = async () => {
    return (
        <div className='flex flex-col items-center min-h-screen h-fit w-full bg-gray-100'>
            <div className='flex flex-col items-center max-w-screen-2xl mx-auto h-full w-full px-[2vw] sm:px-[5vw] lg:px-[8vw] py-5 sm:py-10 lg:py-15'>
                <Breadcrumb pageName="Reports" />
                <ReportDataComponent />
            </div>
        </div>
    );
};

export default ReportPage;
