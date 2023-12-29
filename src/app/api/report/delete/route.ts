import { deleteReport } from "@/lib/prisma/reports";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const reqjson = await request.json();
        const { res: msg, error: deletereporterr } = await deleteReport(reqjson.id);
        if (deletereporterr) {
            return Response.json({ message: "internal server error" }, { status: 500 });
        }
        return Response.json({ message: msg }, { status: 200 });
    } catch (error) {
        return Response.json({ message: "internal server error" }, { status: 500 });
    }
}