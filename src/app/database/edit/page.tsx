import { Metadata } from "next";
import { permanentRedirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { editGeoData, getGeoDataByID } from "@/lib/prisma/geodata";
import { GeoData } from "@prisma/client";

type GeoDataMod = Omit<GeoData, 'id' | 'geoloc_id' | 'geojs' | 'latitude' | 'longitude' | 'datetime_crash' | 'wilayah' | 'createdAt'>
interface GeoDataInput extends GeoDataMod {
    datetime_crash: string
}

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
    async function editData(dataID: string, formData: FormData) {
        'use server'

        if (Number(formData.get('jumlah_kecelakaan')?.toString()) == 0) {
            permanentRedirect('/database/edit?' + new URLSearchParams({
                id: String(searchParams.id),
                error: "Jumlah kecelakaan tidak bisa 0"
            }))
        }
        const rawFormData: GeoDataInput = {
            name: formData.get('nama')?.toString() ?? "",
            datetime_crash: new Date(formData.get('waktu_kecelakaan')?.toString() ?? "").toISOString(),
            jumlah_kecelakaan: Number(formData.get('jumlah_kecelakaan')?.toString()),
            meninggal: Number(formData.get('meninggal')),
            luka_berat: Number(formData.get('luka_berat')),
            luka_ringan: Number(formData.get('luka_ringan')),
            kerugian: Number(formData.get('kerugian')),
        }
        const { res, error } = await editGeoData(dataID, rawFormData);
        if (error) {
            permanentRedirect('/database/edit?' + new URLSearchParams({
                id: String(searchParams.id),
                error: "Update data gagal"
            }))
        }
        revalidatePath('/')
        permanentRedirect('/database/edit?' + new URLSearchParams({
            id: String(searchParams.id),
            message: "Update data berhasil"
        }))
    }
    if (typeof (searchParams.id) == "string") {
        const { res } = await getGeoDataByID(searchParams.id);
        if (res) {
            const dataID = res.id;
            const editDataWithId = editData.bind(null, dataID)

            const showAlert = ((searchParams.message || searchParams.error) ? "" : "hidden ");

            let alertOpt = {
                color: "",
                msg: "",
            }
            if (searchParams.message) {
                alertOpt.color = 'blue';
                alertOpt.msg = searchParams.message.toString();
            } else if (searchParams.error) {
                alertOpt.color = 'red';
                alertOpt.msg = searchParams.error.toString();
            }
            return (
                <div className="flex flex-col items-center min-h-screen h-fit w-full px-[4vw] sm:px-[7vw] lg:px-[15vw] py-5 sm:py-10 lg:py-15 bg-gray-100">
                    <div className="grid  w-full gap-9 ">
                        <div className="flex flex-col w-full gap-9">
                            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                                    <h3 className="font-medium text-black dark:text-white">
                                        Edit Data
                                    </h3>
                                </div>
                                <div className="flex w-[90%] mx-auto">
                                    <div className={showAlert + "p-4 mt-2 border-2 border-" + alertOpt.color + "-800 text-sm text-" + alertOpt.color + "-800 rounded-lg bg-" + alertOpt.color + "-50 dark:bg-gray-500 dark:text-" + alertOpt.color + "-400 w-full mx-auto"} role="alert">
                                        <span className="font-medium">{alertOpt.msg}</span>
                                    </div>
                                </div>
                                <form className="flex w-full flex-col gap-4 py-4 px-8" action={editDataWithId}>
                                    <div>
                                        <div className="mb-2 block">
                                            <label className="text-md" htmlFor="nama" >
                                                Name
                                            </label>
                                        </div>
                                        <input id="nama" name="nama" className="w-full" type="text" placeholder="Masukan nama" defaultValue={res.name} required />
                                    </div>
                                    <div>
                                        <div className="mb-2 block">
                                            <label className="text-md" htmlFor="waktu_kecelakaan" >
                                                Waktu Kecelakaan
                                            </label>
                                        </div>
                                        <input id="waktu_kecelakaan" className="w-full" name="waktu_kecelakaan" type="datetime-local" placeholder="Masukan waktu kecelakaan" defaultValue={res.datetime_crash.toLocaleString('sv-SE').substring(0, 16)} required />
                                    </div>
                                    <div>
                                        <div className="mb-2 block">
                                            <label className="text-md" htmlFor="jumlah_kecelakaan" >
                                                Jumlah Kecelakaan
                                            </label>
                                        </div>
                                        <input id="jumlah_kecelakaan" className="w-full" name="jumlah_kecelakaan" type="number" placeholder="Masukan jumlah kecelakaan" defaultValue={res.jumlah_kecelakaan} required />
                                    </div>
                                    <div>
                                        <div className="mb-2 block">
                                            <label className="text-md" htmlFor="meninggal" >
                                                Meninggal
                                            </label>
                                        </div>
                                        <input id="meninggal" className="w-full" name="meninggal" type="number" placeholder="Masukan jumlah korban meninggal" defaultValue={res.meninggal} required />
                                    </div>
                                    <div>
                                        <div className="mb-2 block">
                                            <label className="text-md" htmlFor="luka_berat" >
                                                Korban Luka Berat
                                            </label>
                                        </div>
                                        <input id="luka_berat" className="w-full" name="luka_berat" type="number" placeholder="Masukan jumlah korban luka berat" defaultValue={res.luka_berat} required />
                                    </div>
                                    <div>
                                        <div className="mb-2 block">
                                            <label className="text-md" htmlFor="luka_ringan" >
                                                Korban Luka Ringan
                                            </label>
                                        </div>
                                        <input id="luka_ringan" className="w-full" name="luka_ringan" type="number" placeholder="Masukan jumlah korban luka ringan" defaultValue={res.luka_ringan} required />
                                    </div>
                                    <div>
                                        <div className="mb-2 block">
                                            <label className="text-md" htmlFor="kerugian" >
                                                Jumlah kerugian
                                            </label>
                                        </div>
                                        <input id="kerugian" className="w-full" name="kerugian" type="number" placeholder="Masukan jumlah kerugian" defaultValue={res.kerugian} required />
                                    </div>
                                    <button type="submit">
                                        Submit
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }
    // return (
    //     <div className="w-full px-[7vw] pt-[4vw]">
    //         <EditForm />
    //     </div>
    // );
};

export default EditFormPage;
