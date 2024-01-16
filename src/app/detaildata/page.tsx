import Breadcrumb from "@/components/Breadcrumbs/BreadcrumbComponent";
import { getGeoDataByID } from "@/lib/prisma/geodata";
import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
    title: "Detail Data Page | TRASK",
    description: "TRASK adalah sistem informasi geografis yang memetakan data berkaitan dengan risiko kecelakaan",
    // other metadata
};

const DetailMapComponent = dynamic(() => import('@/components/DetailMap/DetailMapComponent'), { ssr: false });

async function DetailData({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const data = await getServerSession();
    if (typeof (searchParams.id) == "string") {
        const { res } = await getGeoDataByID(searchParams.id);
        if (res) {
            const spar = searchParams as Object;
            let sumstr = "";
            Object.entries(spar).forEach(([key, value], idx) => {
                sumstr += key + "=" + value;
                if (idx != Object.entries(spar).length - 1) {
                    sumstr += "&"
                }
            })
            return (
                <>
                    <div className='min-h-fit h-full w-full bg-gray-100'>
                        <div className="flex flex-col items-start max-w-screen-2xl mx-auto h-full w-full px-[4vw] sm:px-[7vw] lg:px-[15vw] py-5 sm:py-10 lg:py-15">
                            <Breadcrumb pageName={(data ? ("Database") : ("Data")) + "/Detail Data"} query_string={sumstr} />
                            <div className="text-left w-full">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Detail Data</h1>
                                <div className="h-96 w-full mb-4">
                                    <DetailMapComponent data={res} />
                                </div>
                                <div className="text-base md:text-lg text-gray-600 mb-6">
                                    <div className="flex">
                                        <span className="inline-block max-w-[200px] w-[200px] font-semibold">Nama / Identifikasi</span>
                                        <span className="font-semibold inline-block">:&nbsp;</span>
                                        <span className="font-semibold inline-block max-w-[300px] w-[300px]">{res.name}</span>
                                    </div>
                                    <div className="flex">
                                        <span className="inline-block max-w-[200px] w-[200px] font-semibold">Deskripsi Kecelakaan</span>
                                        <span className="font-semibold inline-block">:&nbsp;</span>
                                        <span className="font-semibold inline-block max-w-[300px] w-[300px]">{res.desc}</span>
                                    </div>
                                    <div className="flex">
                                        <span className="inline-block max-w-[200px] w-[200px] font-semibold">Latitude</span>
                                        <span className="font-semibold inline-block">:&nbsp;</span>
                                        <span className="font-semibold inline-block max-w-[300px] w-[300px]">{res.latitude}</span>
                                    </div>
                                    <div className="flex">
                                        <span className="inline-block max-w-[200px] w-[200px] font-semibold">Longitude</span>
                                        <span className="font-semibold inline-block">:&nbsp;</span>
                                        <span className="font-semibold inline-block max-w-[300px] w-[300px]">{res.longitude}</span>
                                    </div>
                                    <div className="flex">
                                        <span className="inline-block max-w-[200px] w-[200px] font-semibold">Waktu</span>
                                        <span className="font-semibold inline-block">:&nbsp;</span>
                                        <span className="font-semibold inline-block max-w-[300px] w-[300px]">{res.datetime_crash.toISOString()}</span>
                                    </div>
                                    <div className="flex">
                                        <span className="inline-block max-w-[200px] w-[200px] font-semibold">Jumlah Kecelakaan</span>
                                        <span className="font-semibold inline-block">:&nbsp;</span>
                                        <span className="font-semibold inline-block max-w-[300px] w-[300px]">{res.jumlah_kecelakaan}</span>
                                    </div>
                                    <div className="flex">
                                        <span className="inline-block max-w-[200px] w-[200px] font-semibold">Meninggal</span>
                                        <span className="font-semibold inline-block">:&nbsp;</span>
                                        <span className="font-semibold inline-block max-w-[300px] w-[300px]">{res.meninggal}</span>
                                    </div>
                                    <div className="flex">
                                        <span className="inline-block max-w-[200px] w-[200px] font-semibold">Luka Berat</span>
                                        <span className="font-semibold inline-block">:&nbsp;</span>
                                        <span className="font-semibold inline-block max-w-[300px] w-[300px]">{res.luka_berat}</span>
                                    </div>
                                    <div className="flex">
                                        <span className="inline-block max-w-[200px] w-[200px] font-semibold">Luka Ringan</span>
                                        <span className="font-semibold inline-block">:&nbsp;</span>
                                        <span className="font-semibold inline-block max-w-[300px] w-[300px]">{res.luka_ringan}</span>
                                    </div>
                                    <div className="flex">
                                        <span className="inline-block max-w-[200px] w-[200px] font-semibold">Kerugian</span>
                                        <span className="font-semibold inline-block">:&nbsp;</span>
                                        <span className="font-semibold inline-block max-w-[300px] w-[300px]">{res.kerugian.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            );
        }
    }
    return (
        <>
            <div className='min-h-fit h-full w-full bg-gray-100'>
                <div className="flex flex-col items-start max-w-screen-2xl mx-auto h-full w-full px-[4vw] sm:px-[7vw] lg:px-[15vw] py-5 sm:py-10 lg:py-15">
                    <Breadcrumb pageName={(data ? ("Database") : ("Data")) + "/Detail Data"} />
                    <div className="text-left pl-15 mt-20 max-w-xl">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">No Data</h1>
                    </div>

                </div>
            </div>
        </>
    );
};
export default DetailData;