import prisma from ".";

export async function getReports(take: number, page: number) {
    try {
        const res = await prisma.reports.findMany({
            skip: (page - 1) * take,
            take: take,
            select: {
                id: true,
                name: true,
                datetime_crash: true,
                latitude: true,
                longitude: true,
                jumlah_kecelakaan: true,
                processed: true,
                geoloc: {
                    select: {
                        name2: true
                    }
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
        const count = await prisma.reports.count();
        return { res, count };
    } catch (error) {
        return { error };
    }
}

export async function getReportsByName(name: string, take: number, page: number) {
    try {
        const res = await prisma.reports.findMany({
            skip: (page - 1) * take,
            take: take,
            select: {
                id: true,
                name: true,
                datetime_crash: true,
                latitude: true,
                longitude: true,
                jumlah_kecelakaan: true,
                processed: true,
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
                            contains: name,
                            mode: "insensitive"
                        }
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
        const count = await prisma.reports.count({
            where: {
                OR: [{
                    geoloc: {
                        name2: {
                            contains: name,
                            mode: "insensitive"
                        }
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

export async function getReportByLoc(take: number, page: number, tahun: number, geoloc_id: string) {
    try {
        const res = await prisma.reports.findMany({
            skip: (page - 1) * take,
            take: take,
            where: {
                datetime_crash: {
                    gte: new Date(String(tahun) + "-01-01"),
                    lte: new Date(String(tahun + 1) + "-01-01"),
                },
                geoloc: {
                    id: geoloc_id
                },
                processed: false
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
        const count = await prisma.reports.count({
            where: {
                datetime_crash: {
                    gte: new Date(String(tahun) + "-01-01"),
                    lte: new Date(String(tahun + 1) + "-01-01"),
                },
                geoloc: {
                    id: geoloc_id
                },
                processed: false
            },
        });
        return { res, count };
    } catch (error) {
        return { error };
    }
}

export async function getReportYear() {
    try {
        const res = await prisma.reports.aggregateRaw({
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

export async function getReportCount() {
    try {
        const res = await prisma.reports.count();
        return { res };
    } catch (error) {
        return { error };
    }
}

export async function getEligibleReportCount() {
    try {
        const res = await prisma.reports.count({
            where: {
                geoloc_id: {
                    not: null
                },
                processed: false
            }
        });
        return { res };
    } catch (error) {
        return { error };
    }
}

export async function getUnprocessedReportCount() {
    try {
        const res = await prisma.reports.count({
            where: {
                processed: false
            }
        });
        return { res };
    } catch (error) {
        return { error };
    }
}

export async function addReport(data: any) {
    try {
        const res = await prisma.reports.create({
            data: data
        });
        return { res };
    } catch (error) {
        return { error };
    }
}

export async function deleteReport(id: string) {
    try {
        const res = await prisma.reports.delete({
            where: {
                id: id,
            }
        });
        return { res };
    } catch (error) {
        return { error };
    }
}