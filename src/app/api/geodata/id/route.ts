import { getGeoDataByID } from "@/lib/prisma/geodata";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const id = String(request.nextUrl.searchParams.get('id') ?? "");
        const { res: data, error: geodataserr } = await getGeoDataByID(id);
        if (geodataserr) {
            return Response.json({ message: "internal server error" }, { status: 500 });
        }
        return Response.json({ data: data }, { status: 200 });
    } catch (error) {
        return Response.json({ message: "internal server error" }, { status: 500 });
    }
}