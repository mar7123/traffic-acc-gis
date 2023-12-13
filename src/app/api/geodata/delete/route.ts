import { deleteGeoData } from "@/lib/prisma/geodata";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const reqjson = await request.json();
        const { res: msg, error: deletegeodataerr } = await deleteGeoData(reqjson.id);
        if (deletegeodataerr) {
            return Response.json({ message: "internal server error" }, { status: 500 });
        }
        return Response.json({ message: msg }, { status: 200 });
    } catch (error) {
        return Response.json({ message: "internal server error" }, { status: 500 });
    }
}