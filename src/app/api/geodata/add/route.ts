import { addGeoData } from "@/lib/prisma/geodata";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const reqjson = await request.json();
        const { res, error } = await addGeoData(reqjson.geoloc_id, reqjson.data);
        if (error) {
            return Response.json({ message: error }, { status: 500 });
        }
        return Response.json({ data: res }, { status: 201 });
    } catch (error) {
        return Response.json({ message: "internal server error" }, { status: 500 });
    }
}
