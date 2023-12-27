import { getGeoDatas } from "@/lib/prisma/geodata";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const take = Number(request.nextUrl.searchParams.get('take') ?? 10);
        const page = Number(request.nextUrl.searchParams.get('page') ?? 1);
        const { res: data, count: count, error: geodataserr } = await getGeoDatas(take, page);
        if (geodataserr) {
            return Response.json({ message: "internal server error" }, { status: 500 });
        }
        return Response.json({ data: data, count: count }, { status: 200 });
    } catch (error) {
        return Response.json({ message: "internal server error" }, { status: 500 });
    }
}