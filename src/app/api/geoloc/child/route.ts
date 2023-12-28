import { getGeoDataByLoc } from "@/lib/prisma/geodata";
import { getReportByLoc } from "@/lib/prisma/reports";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const take = Number(request.nextUrl.searchParams.get('take') ?? 10);
        const page = Number(request.nextUrl.searchParams.get('page') ?? 1);
        const year = Number(request.nextUrl.searchParams.get('year') ?? 1);
        const geoloc_id = String(request.nextUrl.searchParams.get('geoloc_id') ?? "");
        const { res: geodata_data, count: geodata_count, error: geodata_err } = await getGeoDataByLoc(take, page, year, geoloc_id);
        const { res: report_data, count: report_count, error: report_err } = await getReportByLoc(take, page, year, geoloc_id);
        if (geodata_err || report_err) {
            return Response.json({ message: "internal server error" }, { status: 500 });
        }
        return Response.json({ data: { geodatas: geodata_data, reports: report_data }, count: { geodatas: geodata_count, reports: report_count } }, { status: 200 });
    } catch (error) {
        return Response.json({ message: "internal server error" }, { status: 500 });
    }
}