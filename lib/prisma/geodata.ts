import prisma from ".";
import { SortGeoDataWithGeoLocs, SortableGeoDataKeys } from "@/types/geodata";

export async function getGeoDatas(filter: string, take: number, page: number, sortFilter: SortableGeoDataKeys, sortOrder: 'asc' | 'desc') {
    try {
        let sorter: SortGeoDataWithGeoLocs = {};
        sorter[sortFilter] = sortOrder;
        if (sortFilter == 'wilayah') {
            sorter = {
                geoloc: {
                    name2: sortOrder
                }
            }
        }
        const res = await prisma.geoData.findMany({
            skip: (page - 1) * take,
            take: take,
            select: {
                id: true,
                name: true,
                datetime_crash: true,
                latitude: true,
                longitude: true,
                jumlah_kecelakaan: true,
                geoloc: {
                    select: {
                        name2: true
                    }
                }
            },
            where: {
                OR: [{
                    geoloc: {
                        name2: {
                            contains: filter,
                            mode: "insensitive"
                        }
                    }
                }, {
                    name: {
                        contains: filter,
                        mode: "insensitive"
                    }
                },
                ]
            },
            orderBy: [
                sorter,
                {
                    id: 'asc',
                },
            ],
        })
        const count = await prisma.geoData.count({
            where: {
                OR: [{
                    geoloc: {
                        name2: {
                            contains: filter,
                            mode: "insensitive"
                        }
                    }
                }, {
                    name: {
                        contains: filter,
                        mode: "insensitive"
                    }
                },
                ]
            },
        });
        return { res, count };
    } catch (error) {
        return { error };
    }
}

export async function getGeoDataByID(id: string) {
    try {
        const res = await prisma.geoData.findFirst({
            where: {
                id: id
            },
            include: {
                geoloc: {
                    select: {
                        name2: true
                    }
                }
            }
        })
        return { res };
    } catch (error) {
        return { error };
    }
}

export async function getGeoDataByLoc(take: number, page: number, tahun: number, geoloc_id: string) {
    try {
        const res = await prisma.geoData.findMany({
            skip: (page - 1) * take,
            take: take,
            where: {
                datetime_crash: {
                    gte: new Date(String(tahun) + "-01-01"),
                    lte: new Date(String(tahun + 1) + "-01-01"),
                },
                geoloc: {
                    id: geoloc_id
                }
            },
            orderBy: [
                {
                    datetime_crash: 'asc',
                },
                {
                    id: 'asc',
                },
            ]
        })
        const count = await prisma.geoData.count({
            where: {
                datetime_crash: {
                    gte: new Date(String(tahun) + "-01-01"),
                    lte: new Date(String(tahun + 1) + "-01-01"),
                },
                geoloc: {
                    id: geoloc_id
                }
            },
        });
        return { res, count };
    } catch (error) {
        return { error };
    }
}

export async function getGeoDataYear() {
    try {
        const res = await prisma.geoData.aggregateRaw({
            pipeline: [
                {
                    $project: {
                        "year": {
                            $year: "$datetime_crash"
                        },
                    }
                },
                {
                    $group: {
                        _id: "$year"
                    }
                },
                {
                    $sort: {
                        _id: 1,
                    }
                }
            ]
        });
        return { res };
    } catch (error) {
        return { error };
    }
}

export async function addGeoData(id: string, data: any) {
    try {
        const res = await prisma.geoLocation.update({
            where: {
                id: id
            },
            data: {
                geodatas: {
                    create: data
                }
            }
        });
        return { res };
    } catch (error) {
        return { error };
    }
}

export async function editGeoData(id: string, data: any) {
    try {
        const res = await prisma.geoData.update({
            where: {
                id: id
            },
            data: data
        });
        return { res };
    } catch (error) {
        return { error };
    }
}

export async function deleteGeoData(id: string) {
    try {
        const res = await prisma.geoData.delete({
            where: {
                id: id,
            }
        });
        return { res };
    } catch (error) {
        return { error };
    }
}