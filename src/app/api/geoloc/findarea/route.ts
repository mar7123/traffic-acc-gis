import { findGeoCompByPoint } from "@/lib/prisma/geoloc";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const lat = Number(request.nextUrl.searchParams.get('lat') != undefined ? request.nextUrl.searchParams.get('lat') : 2013);
        const lng = Number(request.nextUrl.searchParams.get('lng') != undefined ? request.nextUrl.searchParams.get('lng') : 2013);
        const { res, error } = await findGeoCompByPoint(lat, lng);
        if (error) {
            return Response.json({ message: error }, { status: 500 });
        }
        return Response.json({ data: res }, { status: 200 });
    } catch (error) {
        return Response.json({ message: "internal server error" }, { status: 500 });
    }
}
