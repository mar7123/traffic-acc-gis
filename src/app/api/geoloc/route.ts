import { getGeoLocsPerYear } from "@/lib/prisma/geoloc";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const year = Number(request.nextUrl.searchParams.get('year') ?? 2013);
        const { res, error } = await getGeoLocsPerYear(year);
        if (error) {
            return Response.json({ message: "internal server error" }, { status: 500 });
        }
        return Response.json({ data: res }, { status: 200 });
    } catch (error) {
        return Response.json({ message: "internal server error" }, { status: 500 });
    }
}
