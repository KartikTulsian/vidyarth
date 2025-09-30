import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // adjust the path to your prisma client

export async function GET() {
  try {
    const colleges = await prisma.schoolCollege.findMany({
      select: {
        school_college_id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(colleges, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch colleges" }, { status: 500 });
  }
}
