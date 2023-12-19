import prisma from ".";

export async function getReports(take: number, page: number) {
    try {
        const res = await prisma.reports.findMany({
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
        const count = await prisma.reports.count();
        return { res, count };
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