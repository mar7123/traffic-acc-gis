import { getGeoLocs } from "@/lib/prisma/geoloc";
import { NextRequest } from "next/server";
import { setTimeout } from "timers/promises";

export async function GET(request: NextRequest) {
    try {
        const year = Number(request.nextUrl.searchParams.get('year') != undefined ? request.nextUrl.searchParams.get('year') : 2013);
        const { res, error } = await getGeoLocs(year);
        if (error) {
            return Response.json({ message: "internal server error" }, { status: 500 });
        }
        return Response.json({ data: res }, { status: 200 });
    } catch (error) {
        return Response.json({ message: "internal server error" }, { status: 500 });
    }
}
