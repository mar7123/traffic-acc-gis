import Breadcrumb from "@/components/Breadcrumbs/BreadcrumbComponent";
import { getGeoDataByID } from "@/lib/prisma/geodata";
import { getServerSession } from "next-auth/next";

async function DetailData({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const data = await getServerSession();
    if (typeof (searchParams.id) == "string") {
        const { res } = await getGeoDataByID(searchParams.id);
        if (res) {
            return (
                <>
                    <div className='min-h-fit h-full w-full bg-gray-100'>
                        <div className="flex flex-col items-start max-w-screen-2xl mx-auto h-full w-full px-[4vw] sm:px-[7vw] lg:px-[15vw] py-5 sm:py-10 lg:py-15">
                            <Breadcrumb pageName={(data ? ("Database") : ("Data")) + "/Detail Data"} />
                            <div className="text-left">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Detail Data</h1>
                                <p className="text-base md:text-lg text-gray-600 mb-6">
                                    <span className="inline-block w-50 font-semibold">Nama</span>
                                    <span className="font-semibold">: {res.name}</span><br />
                                    <span className="inline-block w-50 font-semibold">Latitude</span>
                                    <span className="font-semibold">: {res.latitude}</span><br />
                                    <span className="inline-block w-50 font-semibold">Longitude</span>
                                    <span className="font-semibold">: {res.longitude}</span><br />
                                    <span className="inline-block w-50 font-semibold">Waktu</span>
                                    <span className="font-semibold">: {res.datetime_crash.toISOString()}</span><br />
                                    <span className="inline-block w-50 font-semibold">Wilayah</span>
                                    <span className="font-semibold">: {res.wilayah}</span><br />
                                    <span className="inline-block w-50 font-semibold">Jumlah Kecelakaan</span>
                                    <span className="font-semibold">: {res.jumlah_kecelakaan}</span><br />
                                    <span className="inline-block w-50 font-semibold">Meninggal</span>
                                    <span className="font-semibold">: {res.meninggal}</span><br />
                                    <span className="inline-block w-50 font-semibold">Luka Berat</span>
                                    <span className="font-semibold">: {res.luka_berat}</span><br />
                                    <span className="inline-block w-50 font-semibold">Luka Ringan</span>
                                    <span className="font-semibold">: {res.luka_ringan}</span><br />
                                    <span className="inline-block w-50 font-semibold">Kerugian</span>
                                    <span className="font-semibold">: {res.kerugian.toLocaleString()}</span><br />
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            );
        }
    }
    return (
        <div className='min-h-fit h-full w-full lg:px-[15vw] sm:px-[7vw] lg:py-15 sm:py-10 bg-gray-100'>
            <Breadcrumb pageName={(data ? ("Database") : ("Data")) + "/Detail Data"} />
            <div className="text-left pl-15 mt-20 max-w-xl">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">No Data</h1>
            </div>
        </div>
    );
};
export default DetailData;