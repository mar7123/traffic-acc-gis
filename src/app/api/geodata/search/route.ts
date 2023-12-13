import { getGeoDataByName } from "@/lib/prisma/geodata";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const filter = String(request.nextUrl.searchParams.get('filter') != undefined ? request.nextUrl.searchParams.get('filter') : "");
        const take = Number(request.nextUrl.searchParams.get('take') != undefined ? request.nextUrl.searchParams.get('take') : 10);
        const page = Number(request.nextUrl.searchParams.get('page') != undefined ? request.nextUrl.searchParams.get('page') : 1);
        const { res: data, count: count, error: geosearcherr } = await getGeoDataByName(filter, take, page);
        if (geosearcherr) {
            return Response.json({ message: "internal server error" }, { status: 500 });
        }
        return Response.json({ data: data, count: count }, { status: 200 });
    } catch (error) {
        return Response.json({ message: "internal server error" }, { status: 500 });
    }
}