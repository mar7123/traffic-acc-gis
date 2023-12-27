import { addReport } from "@/lib/prisma/reports";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const reqjson = await request.json();
        const data = reqjson.geoloc_id == null ? reqjson.data :
            ({
                ...reqjson.data,
                geoloc: {
                    connect: {
                        id: reqjson.geoloc_id
                    }
                }
            });
        const { res, error } = await addReport(data);
        if (error) {
            return Response.json({ message: error }, { status: 500 });
        }
        return Response.json({ data: res }, { status: 201 });
    } catch (error) {
        return Response.json({ message: "internal server error" }, { status: 500 });
    }
}
