import { approveReport } from "@/lib/prisma/reports";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const reqjson = await request.json();
        const { res: msg, error: approvereporterr } = await approveReport(reqjson.id);
        if (approvereporterr) {
            return Response.json({ message: "internal server error" }, { status: 500 });
        }
        return Response.json({ message: "report approval success" }, { status: 200 });
    } catch (error) {
        return Response.json({ message: "internal server error" }, { status: 500 });
    }
}