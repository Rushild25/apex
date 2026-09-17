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
    const equipment = searchParams.get("equipment");

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
      where.bodyPart = { contains: bodyPart, mode: 'insensitive' };
    }
    if (target) {
      where.target = { contains: target, mode: 'insensitive' };
    }
    if (equipment && equipment !== "None" && equipment !== "All") {
      where.equipment = { contains: equipment, mode: 'insensitive' };
    }

    const exercises = await prisma.exercise.findMany({
      where,
      orderBy: { name: 'asc' },
      take: 250,
    });

    return NextResponse.json(exercises);
  } catch (error) {
    console.error("Failed to fetch exercises:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, bodyPart, target, equipment, category } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: "Exercise name is required" }, { status: 400 });
    }

    const created = await prisma.exercise.create({
      data: {
        name: name.trim(),
        normalizedName: name.trim().toLowerCase(),
        bodyPart: bodyPart || "Other",
        target: target || bodyPart || "Other",
        equipment: equipment || "Other",
        category: category || "Strength",
        source: "CUSTOM",
        userId,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Failed to create exercise:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
