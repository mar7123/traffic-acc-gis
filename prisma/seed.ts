import prisma from "../lib/prisma";
import bcrypt from "bcrypt";
import provinsi from "./provinsi.json";
import ind_kabkota from "./INDKabKota.json";
import data_kecelakaan from "./data kecelakaan jawa tengah.json";
import { Prisma, GeoLocation, GeoData, Reports } from "@prisma/client";
// import { writeFileSync } from "fs";

type GeoLocInput = Omit<GeoLocation, 'id' | 'createdAt'> & {
    geodatas: { create?: GeoDataInput[] },
}
type GeoDataInput = Omit<GeoData, 'id' | 'geoloc_id' | 'createdAt' | 'datetime_crash'> & {
    datetime_crash: string,
    wilayah?: string,
}

/**
 * Polygon Provinsi
 * @returns 
 */
function indjson() {
    const { features } = ind_kabkota as any;
    const { features: prov } = provinsi;
    const jateng = prov.reduce(function (filtered:any, option:any) {
        if (option.properties.name == "JAWA TENGAH") {
            const temp: GeoLocInput = {
                geoId: 0,
                geoId2: Number(option.properties.prov_id),
                name: "",
                name2: "Jawa Tengah",
                geojs: option,
                geodatas: {
                    create: undefined
                }
            };
            return filtered.concat(temp);
        }
        return filtered;
    }, []);
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
    }, [jateng[0]])
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
            name: item.name,
            desc: "",
            latitude: item.latitude,
            longitude: item.longitude,
            geojs: {
                type: "Feature",
                properties: {
                    name: item.name,
                    wilayah: item.wilayah
                },
                geometry: {
                    type: "Point",
                    coordinates: [item.longitude, item.latitude]
                }
            },
            wilayah: item.wilayah,
            datetime_crash: new Date(String(item.tahun) + "-12-31").toISOString(),
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
    ind.forEach((element: any) => {
        const resfilter = res.filter((elem) => elem.wilayah == element.name2);
        resfilter.forEach((elem)=>{delete elem['wilayah']})
        element.geodatas.create = resfilter;
    });
    const prismageoloc = ind as Prisma.GeoLocationCreateInput[];

    // Drop Collection
    try {
        await prisma.$runCommandRaw({
            drop: "User",
        });
        await prisma.$runCommandRaw({
            drop: "GeoLocation",
        });
        await prisma.$runCommandRaw({
            drop: "GeoData",
        });
        await prisma.$runCommandRaw({
            drop: "Reports",
        });
    } catch (error: any) {
        // console.log(error);
    }

    // Insert Account
    const rand1 = await bcrypt.genSalt(10);
    await prisma.user.create({
        data: {
            email: 'johndoe19@email.com',
            name: 'John Doe',
            password: await bcrypt.hash('John#Doe28', rand1),
            salt: rand1
        },
    })
    const rand2 = await bcrypt.genSalt(10);
    await prisma.user.create({
        data: {
            email: 'janedoe19@email.com',
            name: 'Jane Doe',
            password: await bcrypt.hash('Jane#Doe28', rand2),
            salt: rand2
        },
    })

    // Insert Geoloc and Geodata
    for (let i = 0; i < prismageoloc.length; i++) {
        await prisma.geoLocation.create({
            data: prismageoloc[i]
        });
    }

    // Build Geo Index
    await prisma.$runCommandRaw({
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
    await prisma.$runCommandRaw({
        createIndexes: "GeoData",
        indexes: [
            {
                key: {
                    "geojs.geometry": "2dsphere"
                },
                name: "geospat"
            }
        ]
    });
    const replng = 110.233370;
    const replat = -7.535368;
    const geopolyfind = await prisma.geoLocation.findRaw({
        filter: {
            "geojs.geometry": {
                $geoIntersects: {
                    $geometry: {
                        type: "Point",
                        coordinates: [replng, replat]
                    }
                }
            }
        }
    }) as any;
    await prisma.reports.create({
        data: {
            name: "example report",
            desc: "example report desc",
            latitude: replat,
            longitude: replng,
            geojs: {
                type: "Feature",
                properties: {
                    name: "example report",
                },
                geometry: {
                    type: "Point",
                    coordinates: [replng, replat]
                }
            },
            datetime_crash: new Date("2018-02-02").toISOString(),
            jumlah_kecelakaan: 1,
            meninggal: 0,
            luka_berat: 0,
            luka_ringan: 1,
            kerugian: 100000,
            geoloc: {
                connect: {
                    id: geopolyfind[0]._id.$oid
                }
            }
        }
    });
    await prisma.reports.create({
        data: {
            name: "example report 2",
            desc: "example report desc 2",
            latitude: replat,
            longitude: replng,
            geojs: {
                type: "Feature",
                properties: {
                    name: "example report",
                },
                geometry: {
                    type: "Point",
                    coordinates: [replng, replat]
                }
            },
            datetime_crash: new Date("2018-02-02").toISOString(),
            jumlah_kecelakaan: 1,
            meninggal: 0,
            luka_berat: 0,
            luka_ringan: 1,
            kerugian: 100000,
            geoloc: {
                connect: {
                    id: geopolyfind[0]._id.$oid
                }
            },
            processed: true
        }
    });
    await prisma.reports.create({
        data: {
            name: "example report 3",
            desc: "example report desc 3",
            latitude: replat,
            longitude: replng,
            geojs: {
                type: "Feature",
                properties: {
                    name: "example report",
                },
                geometry: {
                    type: "Point",
                    coordinates: [replng, replat]
                }
            },
            datetime_crash: new Date("2018-03-03").toISOString(),
            jumlah_kecelakaan: 1,
            meninggal: 2,
            luka_berat: 1,
            luka_ringan: 0,
            kerugian: 100000,
            geoloc: {
                connect: {
                    id: geopolyfind[0]._id.$oid
                }
            },
        }
    });
    const geopolyfind2 = await prisma.geoLocation.findRaw({
        filter: {
            "geojs.geometry": {
                $geoIntersects: {
                    $geometry: {
                        type: "Point",
                        coordinates: [110.37963867187501, -7.051830774037793]
                    }
                }
            }
        }
    }) as any;
    await prisma.reports.create({
        data: {
            name: "example report 4",
            desc: "example report desc 4",
            latitude: -7.051830774037793,
            longitude: 110.37963867187501,
            geojs: {
                type: "Feature",
                properties: {
                    name: "example report",
                },
                geometry: {
                    type: "Point",
                    coordinates: [110.37963867187501, -7.051830774037793]
                }
            },
            datetime_crash: new Date("2018-03-03").toISOString(),
            jumlah_kecelakaan: 1,
            meninggal: 2,
            luka_berat: 1,
            luka_ringan: 0,
            kerugian: 100000,
            geoloc: {
                connect: {
                    id: geopolyfind2[0]._id.$oid
                }
            },
        }
    });
    const geopolyfind3 = await prisma.geoLocation.findRaw({
        filter: {
            "geojs.geometry": {
                $geoIntersects: {
                    $geometry: {
                        type: "Point",
                        coordinates: [109.89349365234376, -7.051830774037793]
                    }
                }
            }
        }
    }) as any;
    await prisma.reports.create({
        data: {
            name: "example report 5",
            desc: "example report desc 5",
            latitude: -7.051830774037793,
            longitude: 109.89349365234376,
            geojs: {
                type: "Feature",
                properties: {
                    name: "example report",
                },
                geometry: {
                    type: "Point",
                    coordinates: [109.89349365234376, -7.0082158366633935]
                }
            },
            datetime_crash: new Date("2018-03-03").toISOString(),
            jumlah_kecelakaan: 1,
            meninggal: 2,
            luka_berat: 1,
            luka_ringan: 0,
            kerugian: 100000,
            geoloc: {
                connect: {
                    id: geopolyfind3[0]._id.$oid
                }
            },
        }
    });
    const geopolyfind4 = await prisma.geoLocation.findRaw({
        filter: {
            "geojs.geometry": {
                $geoIntersects: {
                    $geometry: {
                        type: "Point",
                        coordinates: [109.63256835937501, -7.087264887963057]
                    }
                }
            }
        }
    }) as any;
    await prisma.reports.create({
        data: {
            name: "example report 6",
            desc: "example report desc 6",
            latitude: -7.087264887963057,
            longitude: 109.63256835937501,
            geojs: {
                type: "Feature",
                properties: {
                    name: "example report",
                },
                geometry: {
                    type: "Point",
                    coordinates: [109.63256835937501, -7.087264887963057]
                }
            },
            datetime_crash: new Date("2018-03-03").toISOString(),
            jumlah_kecelakaan: 1,
            meninggal: 2,
            luka_berat: 1,
            luka_ringan: 0,
            kerugian: 100000,
            geoloc: {
                connect: {
                    id: geopolyfind4[0]._id.$oid
                }
            },
        }
    });
    const geopolyfind5 = await prisma.geoLocation.findRaw({
        filter: {
            "geojs.geometry": {
                $geoIntersects: {
                    $geometry: {
                        type: "Point",
                        coordinates: [109.1514142, -6.8675955]
                    }
                }
            }
        }
    }) as any;
    await prisma.reports.create({
        data: {
            name: "example report 7",
            desc: "example report desc 7",
            latitude: -6.8675955,
            longitude: 109.1514142,
            geojs: {
                type: "Feature",
                properties: {
                    name: "example report",
                },
                geometry: {
                    type: "Point",
                    coordinates: [109.1514142, -6.8675955]
                }
            },
            datetime_crash: new Date("2018-03-03").toISOString(),
            jumlah_kecelakaan: 1,
            meninggal: 2,
            luka_berat: 1,
            luka_ringan: 0,
            kerugian: 100000,
            geoloc: {
                connect: {
                    id: geopolyfind5[0]._id.$oid
                }
            },
        }
    });
    await prisma.reports.create({
        data: {
            name: "example report 8",
            desc: "example report desc 8",
            latitude: -6.8675955,
            longitude: 109.1514142,
            geojs: {
                type: "Feature",
                properties: {
                    name: "example report",
                },
                geometry: {
                    type: "Point",
                    coordinates: [109.1514142, -6.8675955]
                }
            },
            datetime_crash: new Date("2018-03-03").toISOString(),
            jumlah_kecelakaan: 1,
            meninggal: 2,
            luka_berat: 1,
            luka_ringan: 0,
            kerugian: 100000,
            geoloc: {
                connect: {
                    id: geopolyfind5[0]._id.$oid
                }
            },
        }
    });
    await prisma.reports.create({
        data: {
            name: "example report 9",
            desc: "example report desc 9",
            latitude: -6.8675955,
            longitude: 109.1514142,
            geojs: {
                type: "Feature",
                properties: {
                    name: "example report",
                },
                geometry: {
                    type: "Point",
                    coordinates: [109.1514142, -6.8675955]
                }
            },
            datetime_crash: new Date("2018-03-03").toISOString(),
            jumlah_kecelakaan: 1,
            meninggal: 2,
            luka_berat: 1,
            luka_ringan: 0,
            kerugian: 100000,
            geoloc: {
                connect: {
                    id: geopolyfind5[0]._id.$oid
                }
            },
        }
    });
    await prisma.reports.create({
        data: {
            name: "example report 10",
            desc: "example report desc 10",
            latitude: -6.8675955,
            longitude: 109.1514142,
            geojs: {
                type: "Feature",
                properties: {
                    name: "example report",
                },
                geometry: {
                    type: "Point",
                    coordinates: [109.1514142, -6.8675955]
                }
            },
            datetime_crash: new Date("2018-03-03").toISOString(),
            jumlah_kecelakaan: 1,
            meninggal: 2,
            luka_berat: 1,
            luka_ringan: 0,
            kerugian: 100000,
            geoloc: {
                connect: {
                    id: geopolyfind5[0]._id.$oid
                }
            },
        }
    });
    await prisma.geoData.create({
        data: {
            name: "example processed report",
            desc: "example processed report desc",
            latitude: replat,
            longitude: replng,
            geojs: {
                type: "Feature",
                properties: {
                    name: "example report",
                },
                geometry: {
                    type: "Point",
                    coordinates: [replng, replat]
                }
            },
            datetime_crash: new Date("2018-03-03").toISOString(),
            jumlah_kecelakaan: 1,
            meninggal: 2,
            luka_berat: 1,
            luka_ringan: 0,
            kerugian: 100000,
            geoloc: {
                connect: {
                    id: geopolyfind[0]._id.$oid
                }
            },
        }
    });
    await prisma.reports.create({
        data: {
            name: "example null location report",
            desc: "example null location report desc",
            latitude: replat,
            longitude: replng,
            geojs: {
                type: "Feature",
                properties: {
                    name: "example report 2",
                },
                geometry: {
                    type: "Point",
                    coordinates: [replng, replat]
                }
            },
            datetime_crash: new Date("2018-02-02").toISOString(),
            jumlah_kecelakaan: 1,
            meninggal: 0,
            luka_berat: 0,
            luka_ringan: 1,
            kerugian: 100000,
        }
    });
    const georeportidx = await prisma.$runCommandRaw({
        createIndexes: "Reports",
        indexes: [
            {
                key: {
                    "geojs.geometry": "2dsphere"
                },
                name: "geospat"
            }
        ]
    });
    const reportNoRel = await prisma.reports.findMany({
        where: {
            geoloc: null
        }
    });
    console.log(reportNoRel);
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