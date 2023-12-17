import { getGeoDataByID } from "@/lib/prisma/geodata";

async function DetailData({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    if (typeof (searchParams.id) == "string") {
        const { res } = await getGeoDataByID(searchParams.id);
        if (res) {
            return (
                <div className='min-h-fit h-full w-full lg:px-[15vw] sm:px-[7vw] lg:py-20 sm:py-10 bg-gray-100'>
                    {/* <TextDetailData/> */}
                    <div className="text-left">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Detail Data</h1>
                        <p className="text-base md:text-lg text-gray-600 mb-6">
                            <span className="inline-block w-50 font-semibold">Tahun</span>
                            <span className="font-semibold">: {res.tahun}</span><br />
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
                    {/* Konten halaman Anda akan ada di sini */}
                </div>
            );
        }
    }
    return (
        <div className='h-[3029px] w-full px-[7vw] bg-cover bg-top' style={{ backgroundImage: "url('/assets/bg/bg-landing.png')" }}>
            {/* <TextDetailData/> */}
            <div className="text-left pl-15 mt-20 max-w-xl">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">No Data</h1>
            </div>
            {/* Konten halaman Anda akan ada di sini */}
        </div>
    );
};
export default DetailData;