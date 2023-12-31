'use server'
import { editGeoData } from "@/lib/prisma/geodata";
import { addGeoData } from "@/lib/prisma/geodata";
import { GeoData } from "@prisma/client";
import { revalidatePath } from "next/cache";

type GeoDataAddMod = Omit<GeoData, 'id' | 'geoloc_id' | 'datetime_crash' | 'geojs' | 'createdAt'>
type GeoDataEditMod = Omit<GeoData, 'id' | 'geoloc_id' | 'geojs' | 'latitude' | 'longitude' | 'datetime_crash' | 'wilayah' | 'createdAt'>
interface GeoDataAdd extends GeoDataAddMod {
    datetime_crash: string,
    geojs: JSON
}
interface GeoDataEdit extends GeoDataEditMod {
    datetime_crash: string
}

export async function editDataAction(prevState: any, formData: FormData) {
    try {
        const dataID = formData.get('geodata_id')?.toString() ?? "";
        const rawFormData: GeoDataEdit = {
            name: formData.get('nama')?.toString() ?? "",
            datetime_crash: new Date(formData.get('waktu_kecelakaan')?.toString() ?? "").toISOString(),
            jumlah_kecelakaan: Number(formData.get('jumlah_kecelakaan')),
            meninggal: Number(formData.get('meninggal')),
            luka_berat: Number(formData.get('luka_berat')),
            luka_ringan: Number(formData.get('luka_ringan')),
            kerugian: Number(formData.get('kerugian')),
        }
        if (rawFormData.jumlah_kecelakaan <= 0) {
            return { message: "Jumlah kecelakaan harus lebih dari 0" };
        }
        const { res, error } = await editGeoData(dataID, rawFormData);
        if (error) {
            return { message: "Update data gagal" };
        }
        revalidatePath('/')
        return { message: "Update data berhasil" };
    } catch (e) {
        return { message: "Update data gagal" };
    }
}

export async function addDataAction(prevState: any, formData: FormData) {
    try {
        const geoloc_id = String(formData.get('geoloc_id') ?? "");
        if (geoloc_id == "") {
            return { message: "Wilayah tidak tersedia" };
        }
        const rawFormData: GeoDataAdd = {
            name: String(formData.get("nama") ?? ""),
            latitude: Number(formData.get("latitude") ?? ""),
            longitude: Number(formData.get("longitude") ?? ""),
            geojs: Object(formData.get("geojs") ?? {}),
            wilayah: String(formData.get("wilayah") ?? ""),
            datetime_crash: new Date(formData.get('waktu_kecelakaan')?.toString() ?? "").toISOString(),
            jumlah_kecelakaan: Number(formData.get("jumlah_kecelakaan") ?? ""),
            meninggal: Number(formData.get("meninggal") ?? ""),
            luka_berat: Number(formData.get("luka_berat") ?? ""),
            luka_ringan: Number(formData.get("luka_ringan") ?? ""),
            kerugian: Number(formData.get("kerugian") ?? ""),
        }
        if (rawFormData.jumlah_kecelakaan <= 0) {
            return { message: "Jumlah kecelakaan harus lebih dari 0" };
        }
        const { res, error } = await addGeoData(geoloc_id, rawFormData);
        if (error) {
            return { message: "Tambah data gagal" };
        }
        revalidatePath('/')
        return { message: "Tambah data berhasil" };
    } catch (e) {
        return { message: "Tambah data gagal" };
    }
}