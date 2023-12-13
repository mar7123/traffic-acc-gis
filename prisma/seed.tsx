import prisma from "../lib/prisma";
import bcrypt from "bcrypt";
import ind_kabkota from "./INDKabKota.json";
import data_kecelakaan from "./data kecelakaan jawa tengah.json";
import { Prisma } from "@prisma/client";
import { writeFileSync } from "fs";


interface GeoDataInput {
    wilayah: string,
    tahun: number,
    jumlah_kecelakaan: number,
    meninggal: number,
    luka_berat: number,
    luka_ringan: number,
    kerugian: number,
}
interface GeoLocInput {
    geoId: number,
    geoId2: number,
    name: string,
    name2: string,
    geojs: Prisma.InputJsonValue
    geodatas: { create?: GeoDataInput[] }
}
/**
 * Polygon Provinsi
 * @returns 
 */
function indjson() {
    const { features } = ind_kabkota as any;
    const ind = features.reduce(function (filtered: any, option: any) {
        if (option.properties.NAME_1 == "Jawa Tengah") {
            const temp: GeoLocInput = {
                geoId: Number(option.properties.ID_1),
                geoId2: Number(option.properties.ID_2),
                name: option.properties.NAME_1,
                name2: option.properties.NAME_2,
                geojs: option,
                geodatas: {
                    create: undefined
                }
            };
            return filtered.concat(temp);
        }
        return filtered;
    }, [])
    return { ind };
}
/**
 * Data
 * @returns 
 */
function datakecjson() {
    const data = data_kecelakaan;
    const res = data.map((item) => {
        const temp: GeoDataInput = {
            wilayah: item.wilayah,
            tahun: item.tahun,
            jumlah_kecelakaan: item.jumlah_kecelakaan,
            meninggal: item.meninggal,
            luka_berat: item.luka_berat,
            luka_ringan: item.luka_ringan,
            kerugian: item.kerugian,
        }
        return temp
    });
    return { res };
}

async function main() {
    const { ind } = indjson();
    const { res } = datakecjson();

    // Convert to prisma input
    const prismageodata = res as Prisma.GeoDataCreateManyInput[];
    ind.forEach((element: any) => {
        const resfilter = prismageodata.filter((elem) => elem.wilayah == element.name2);
        element.geodatas.create = resfilter;
    });
    const prismageoloc = ind as Prisma.GeoLocationCreateInput[];

    // Drop Collection
    try {
        const dropuser = await prisma.$runCommandRaw({
            drop: "User",
        });
        const dropgeoloc = await prisma.$runCommandRaw({
            drop: "GeoLocation",
        });
        const dropgeodata = await prisma.$runCommandRaw({
            drop: "GeoData",
        });
    } catch (error: any) {
        // console.log(error);
    }

    // Insert Account
    const rand1 = await bcrypt.genSalt(10);
    const johndoe = await prisma.user.create({
        data: {
            email: 'johndoe19@email.com',
            name: 'John Doe',
            password: await bcrypt.hash('johndoe123', rand1),
            salt: rand1
        },
    })
    const rand2 = await bcrypt.genSalt(10);
    const janedoe = await prisma.user.create({
        data: {
            email: 'janedoe19@email.com',
            name: 'Jane Doe',
            password: await bcrypt.hash('janedoe123', rand2),
            salt: rand2
        },
    })

    // Insert Geoloc and Geodata
    for (let i = 0; i < prismageoloc.length; i++) {
        const gjs = await prisma.geoLocation.create({
            data: prismageoloc[i]
        });
    }

    // Build Geo Index
    const geoidx = await prisma.$runCommandRaw({
        createIndexes: "GeoLocation",
        indexes: [
            {
                key: {
                    "geojs.geometry": "2dsphere"
                },
                name: "geospat"
            }
        ]
    });
    // const geofind = await prisma.geoLocation.findRaw({
    //     filter: {
    //         geometry: {
    //             $geoWithin: {
    //                 $geometry: {
    //                     type: "Polygon",
    //                     coordinates: [[[0, 0], [3, 6], [6, 1], [0, 0]]]
    //                 }
    //             }
    //         }
    //     }
    // });
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })