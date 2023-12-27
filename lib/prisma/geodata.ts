import prisma from ".";

export async function getGeoDatas(take: number, page: number) {
    try {
        const res = await prisma.geoData.findMany({
            skip: (page - 1) * take,
            take: take,
            orderBy: [
                {
                    datetime_crash: 'asc',
                },
                {
                    id: 'asc',
                },
            ]
        })
        const count = await prisma.geoData.count();
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
            }
        })
        return { res };
    } catch (error) {
        return { error };
    }
}

export async function getGeoDataByName(name: string, take: number, page: number) {
    try {
        const res = await prisma.geoData.findMany({
            skip: (page - 1) * take,
            take: take,
            where: {
                OR: [{
                    wilayah: {
                        contains: name,
                        mode: "insensitive"
                    }
                }, {
                    name: {
                        contains: name,
                        mode: "insensitive"
                    }
                },
                ]
            },
            orderBy: [
                {
                    datetime_crash: 'asc',
                },
                {
                    id: 'asc',
                },
            ]
        });
        const count = await prisma.geoData.count({
            where: {
                OR: [{
                    wilayah: {
                        contains: name,
                        mode: "insensitive"
                    }
                }, {
                    name: {
                        contains: name,
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
        const count = await prisma.geoData.count();
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