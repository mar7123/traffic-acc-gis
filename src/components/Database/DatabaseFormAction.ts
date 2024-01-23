'use server'
import { editGeoData } from "@/lib/prisma/geodata";
import { addGeoData } from "@/lib/prisma/geodata";
import { GeoData } from "@prisma/client";
import { revalidatePath } from "next/cache";

type GeoDataOmit = Omit<GeoData, 'id' | 'geoloc_id' | 'datetime_crash' | 'geojs' | 'createdAt'>
interface GeoDataMod extends GeoDataOmit {
    datetime_crash: string,
    geojs: JSON
}

export async function editDataAction(prevState: any, formData: FormData) {
    try {
        const geoloc_id = String(formData.get('geoloc_id') ?? "");
        if (geoloc_id == "") {
            return { message: "Wilayah tidak tersedia" };
        }
        const dataID = formData.get('geodata_id')?.toString() ?? "";
        const geojson = Object({
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [Number(formData.get("longitude") ?? "0"), Number(formData.get("latitude") ?? "0")]
            },
            properties: {
                name: formData.get('nama')?.toString() ?? ""
            }
        });
        const rawFormData = {
            name: formData.get('nama')?.toString() ?? "",
            geoloc_id: String(formData.get('geoloc_id') ?? ""),
            desc: formData.get('desc')?.toString() ?? "",
            latitude: Number(formData.get("latitude") ?? "0"),
            longitude: Number(formData.get("longitude") ?? "0"),
            geojs: geojson,
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
        const geojson = Object({
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [Number(formData.get("longitude") ?? "0"), Number(formData.get("latitude") ?? "0")]
            },
            properties: {
                name: formData.get('nama')?.toString() ?? ""
            }
        });
        const rawFormData: GeoDataMod = {
            name: String(formData.get("nama") ?? ""),
            desc: formData.get('desc')?.toString() ?? "",
            latitude: Number(formData.get("latitude") ?? ""),
            longitude: Number(formData.get("longitude") ?? ""),
            geojs: geojson,
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