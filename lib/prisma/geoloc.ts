import prisma from ".";

export async function getGeoLocsPerYear(tahun: number) {
    try {
        const geolocs = await prisma.geoLocation.findMany({
            include: {
                // geodatas: {
                //     where: {
                //         datetime_crash: {
                //             gte: new Date(String(tahun) + "-01-01"),
                //             lte: new Date(String(tahun + 1) + "-01-01"),
                //         },
                //     }
                // },
                _count: {
                    select: {
                        georeports: {
                            where: {
                                datetime_crash: {
                                    gte: new Date(String(tahun) + "-01-01"),
                                    lte: new Date(String(tahun + 1) + "-01-01"),
                                },
                                processed: false
                            }
                        }
                    }
                }
            }
        })
        const geolocid = geolocs.map((item) => { return item.id });
        const geodataGroup = await prisma.geoData.groupBy({
            by: ['geoloc_id'],
            _sum: {
                jumlah_kecelakaan: true,
            },
            where: {
                geoloc_id: {
                    in: geolocid,
                },
                datetime_crash: {
                    gte: new Date(String(tahun) + "-01-01"),
                    lte: new Date(String(tahun + 1) + "-01-01"),
                },
            }
        })
        const res = geolocs.map((item) => {
            const filtered = geodataGroup.filter((item_filter) => item_filter.geoloc_id == item.id);
            return { ...item, agregate: filtered };
        })
        return { res };
    } catch (error) {
        return { error };
    }
}

export async function findGeoCompByPoint(lat: number, lng: number) {
    try {
        const res = await prisma.geoLocation.findRaw({
            filter: {
                "geojs.geometry": {
                    $geoIntersects: {
                        $geometry: {
                            type: "Point",
                            coordinates: [lng, lat]
                        }
                    }
                },
            },
            options: {
                projection: {
                    _id: 1,
                    name2: 1
                }
            }
        });
        return { res };
    } catch (error) {
        return { error };
    }
}