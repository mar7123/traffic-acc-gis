import { getGeoDataYear } from "@/lib/prisma/geodata";
import { getReportYear } from "@/lib/prisma/reports";
import { revalidatePath } from 'next/cache'
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { res: geodata_data, error: geodataserr } = await getGeoDataYear();
        const { res: report_data, error: reportserr } = await getReportYear();
        if (geodataserr || reportserr) {
            return Response.json({ message: "internal server error" }, { status: 500 });
        }
        const geodata_arr: { _id: number }[] = geodata_data as any;
        const report_arr: { _id: number }[] = report_data as any;
        const geodata_mapped = geodata_arr.map((item) => item._id);
        const report_mapped = report_arr.map((item) => item._id);
        const nodups = new Set(geodata_mapped.concat(report_mapped))
        let nodups_arr: number[] = [];
        nodups.forEach((item) => {
            nodups_arr.push(item);
        })
        nodups_arr.sort();
        const path = request.nextUrl.searchParams.get('path')
        revalidatePath(path ?? "/");
        return Response.json({ data: nodups_arr }, { status: 200 });
    } catch (error) {
        return Response.json({ message: "internal server error" }, { status: 500 });
    }
}