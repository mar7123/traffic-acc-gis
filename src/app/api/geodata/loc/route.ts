import { getGeoDataByLoc } from "@/lib/prisma/geodata";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const take = Number(request.nextUrl.searchParams.get('take') ?? 10);
        const page = Number(request.nextUrl.searchParams.get('page') ?? 1);
        const year = Number(request.nextUrl.searchParams.get('year') ?? 1);
        const geoloc_id = String(request.nextUrl.searchParams.get('geoloc_id') ?? "");
        const { res: data, count: count, error: geosearcherr } = await getGeoDataByLoc(take, page, year, geoloc_id);
        if (geosearcherr) {
            return Response.json({ message: "internal server error" }, { status: 500 });
        }
        return Response.json({ data: data, count: count }, { status: 200 });
    } catch (error) {
        return Response.json({ message: "internal server error" }, { status: 500 });
    }
}