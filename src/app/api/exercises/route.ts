import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function GET(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const bodyPart = searchParams.get("bodyPart");
    const target = searchParams.get("target");

    const where: Prisma.ExerciseWhereInput = {
      isArchived: false,
      OR: [
        { source: "SYSTEM" },
        { userId: userId }
      ]
    };

    if (search) {
      where.normalizedName = { 
        contains: search.toLowerCase(),
        mode: 'insensitive'
      };
    }
    if (bodyPart) {
      where.bodyPart = bodyPart;
    }
    if (target) {
      where.target = target;
    }

    const exercises = await prisma.exercise.findMany({
      where,
      orderBy: { name: 'asc' },
      take: 100, // Client side should virtualize or we implement pagination
    });

    return NextResponse.json(exercises);
  } catch (error) {
    console.error("Failed to fetch exercises:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
